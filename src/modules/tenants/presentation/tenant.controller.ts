import type { Request, Response, NextFunction } from 'express';
import { CreateTenantUseCase } from '../application/createTenant.usecase.js';
import { TenantRepository } from '../infrastructure/tenant.repository.js';
import { createTenantSchema } from './tenant.schema.js';
import { BadRequestError } from '../../../common/errors/index.js';

const repo              = new TenantRepository();
const createTenantUseCase = new CreateTenantUseCase(repo);

export const createTenant = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = createTenantSchema.safeParse(req.body);
    if (!parsed.success) throw new BadRequestError('Validation failed', parsed.error.flatten());

    const tenant = await createTenantUseCase.execute(parsed.data, req.user!.sub);
    res.status(201).json({ success: true, data: tenant });
  } catch (err) {
    next(err);
  }
};

export const getAllTenants = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const tenants = await repo.findAll();
    res.status(200).json({ success: true, data: tenants });
  } catch (err) {
    next(err);
  }
};
