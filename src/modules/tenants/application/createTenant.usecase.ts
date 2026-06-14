import type { ITenantRepository } from '../domain/ITenantRepository.js';
import type { ITenant } from '../domain/tenant.types.js';
import { TenantStatus } from '../domain/tenant.types.js';
import { logger } from '../../../common/utils/index.js';

export interface CreateTenantDto {
  name:                  string;
  chargerRange:          number;
  subscriptionExpiry:    Date;
  numberOfSubscriptions: number;
  numberOfEmployees:     number;
}

export class CreateTenantUseCase {
  constructor(private readonly repo: ITenantRepository) {}

  async execute(dto: CreateTenantDto, createdBy: string): Promise<ITenant> {
    logger.debug('[CreateTenant] Request', { name: dto.name, createdBy });

    const tenant = await this.repo.create({
      ...dto,
      status:    TenantStatus.ACTIVE,
      createdBy,
    });

    logger.info('[CreateTenant] Tenant created', { tenantId: tenant._id, name: tenant.name, createdBy });

    return tenant;
  }
}
