import type { Request, Response, NextFunction } from 'express';
import { LoginUseCase } from '../application/login.usecase.js';
import { CreateUserUseCase } from '../application/createUser.usecase.js';
import { SetupPasswordUseCase } from '../application/setupPassword.usecase.js';
import { AuthRepository } from '../infrastructure/auth.repository.js';
import { TenantRepository } from '../../tenants/infrastructure/tenant.repository.js';
import { loginSchema, createUserSchema, setupPasswordSchema } from './auth.schema.js';
import { BadRequestError } from '../../../common/errors/index.js';

const repo               = new AuthRepository();
const tenantRepo         = new TenantRepository();
const loginUseCase       = new LoginUseCase(repo);
const createUserUseCase  = new CreateUserUseCase(repo, tenantRepo);
const setupPasswordUseCase = new SetupPasswordUseCase(repo);

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) throw new BadRequestError('Validation failed', parsed.error.flatten());

    const result = await loginUseCase.execute(parsed.data);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = createUserSchema.safeParse(req.body);
    if (!parsed.success) throw new BadRequestError('Validation failed', parsed.error.flatten());

    const user = await createUserUseCase.execute(parsed.data, {
      actorRole:      req.user!.role,
      actorTenantId:  req.user!.tenantId ?? undefined,
    });
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

export const setupPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = setupPasswordSchema.safeParse(req.body);
    if (!parsed.success) throw new BadRequestError('Validation failed', parsed.error.flatten());

    await setupPasswordUseCase.execute(parsed.data);
    res.status(200).json({ success: true, message: 'Password set successfully. You can now log in.' });
  } catch (err) {
    next(err);
  }
};
