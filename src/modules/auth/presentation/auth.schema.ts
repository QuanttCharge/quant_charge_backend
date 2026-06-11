import { z } from 'zod';
import { UserRole } from '../../users/domain/user.types.js';

export const loginSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(8),
});

export const createUserSchema = z.object({
  name:      z.string().min(1),
  email:     z.string().email(),
  password:  z.string().min(8),
  role:      z.nativeEnum(UserRole),
  tenantId:  z.string().optional(),
});

export type LoginInput      = z.infer<typeof loginSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
