import type { Request, Response, NextFunction } from 'express';
import { LoginUseCase } from '../application/login.usecase.js';
import { CreateUserUseCase } from '../application/createUser.usecase.js';
import { AuthRepository } from '../infrastructure/auth.repository.js';
import { loginSchema, createUserSchema } from './auth.schema.js';
import { BadRequestError } from '../../../common/errors/index.js';

const repo            = new AuthRepository();
const loginUseCase    = new LoginUseCase(repo);
const createUserUseCase = new CreateUserUseCase(repo);

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

    const user = await createUserUseCase.execute(parsed.data);
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};
