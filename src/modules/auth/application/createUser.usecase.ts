import { randomBytes } from 'crypto';
import type { IAuthRepository } from '../domain/IAuthRepository.js';
import type { ITenantRepository } from '../../tenants/domain/ITenantRepository.js';
import type { CreateUserDto } from './auth.dto.js';
import type { IUserPublic } from '../../users/domain/user.types.js';
import { UserRole, UserStatus } from '../../users/domain/user.types.js';
import { ConflictError, ForbiddenError, BadRequestError, NotFoundError } from '../../../common/errors/index.js';
import { sendSetupPasswordEmail } from '../../../common/utils/email.js';
import { logger } from '../../../common/utils/index.js';

// Roles each actor is allowed to create
const ALLOWED_ROLES: Record<UserRole, UserRole[]> = {
  [UserRole.SUPER_ADMIN]:  [UserRole.TENANT_ADMIN],
  [UserRole.TENANT_ADMIN]: [UserRole.OPERATOR, UserRole.DRIVER, UserRole.SUPPORT],
  [UserRole.OPERATOR]:     [],
  [UserRole.DRIVER]:       [],
  [UserRole.SUPPORT]:      [],
};

// Only super_admin can create tenant_admin
const SUPER_ADMIN_ONLY_ROLES: UserRole[] = [UserRole.TENANT_ADMIN];

export interface CreateUserContext {
  actorRole:      UserRole;
  actorTenantId?: string;
}

export class CreateUserUseCase {
  constructor(
    private readonly repo:       IAuthRepository,
    private readonly tenantRepo: ITenantRepository,
  ) {}

  async execute(dto: CreateUserDto, ctx: CreateUserContext): Promise<IUserPublic> {
    logger.debug('[CreateUser] Request', { actor: ctx.actorRole, actorTenantId: ctx.actorTenantId, targetRole: dto.role, email: dto.email });

    // 1. Check actor is allowed to assign this role
    const allowed = ALLOWED_ROLES[ctx.actorRole] ?? [];
    if (!allowed.includes(dto.role)) {
      logger.warn('[CreateUser] Forbidden role assignment', { actor: ctx.actorRole, attemptedRole: dto.role });
      throw new ForbiddenError(`You are not allowed to create a user with role '${dto.role}'`);
    }

    // 2. Extra guard — tenant_admin role is super_admin only
    if (SUPER_ADMIN_ONLY_ROLES.includes(dto.role) && ctx.actorRole !== UserRole.SUPER_ADMIN) {
      logger.warn('[CreateUser] Only super_admin can create tenant_admin', { actor: ctx.actorRole });
      throw new ForbiddenError('Only super admin can create a tenant admin');
    }

    // 2. Resolve tenantId based on actor
    let tenantId: string | undefined;

    if (ctx.actorRole === UserRole.SUPER_ADMIN) {
      if (!dto.tenantId) throw new BadRequestError('tenantId is required when creating a tenant admin');

      const tenant = await this.tenantRepo.findById(dto.tenantId);
      if (!tenant) {
        logger.warn('[CreateUser] Tenant not found', { tenantId: dto.tenantId });
        throw new NotFoundError(`Tenant with id '${dto.tenantId}' not found`);
      }

      logger.debug('[CreateUser] Tenant validated', { tenantId: tenant._id, tenantName: tenant.name });
      tenantId = dto.tenantId;
    } else {
      tenantId = ctx.actorTenantId;
    }

    // 3. Check email uniqueness
    const existing = await this.repo.findByEmail(dto.email);
    if (existing) {
      logger.warn('[CreateUser] Email already in use', { email: dto.email });
      throw new ConflictError('Email already in use');
    }

    // 4. Create user with setup token
    const setupToken          = randomBytes(32).toString('hex');
    const setupTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const user = await this.repo.create({
      name:                dto.name,
      email:               dto.email,
      passwordHash:        '',
      role:                dto.role,
      status:              UserStatus.ACTIVE,
      tenantId,
      isPasswordSet:       false,
      setupToken,
      setupTokenExpiresAt,
    });

    logger.info('[CreateUser] User created', { userId: user._id, email: user.email, role: user.role, tenantId });

    const setupLink = `${process.env.FRONTEND_URL}/setup-password?token=${setupToken}`;
    await sendSetupPasswordEmail(user.email, user.name, setupLink);
    logger.info('[CreateUser] Setup email sent', { email: user.email });

    return {
      _id:      user._id,
      name:     user.name,
      email:    user.email,
      role:     user.role,
      status:   user.status,
      tenantId: user.tenantId,
    };
  }
}
