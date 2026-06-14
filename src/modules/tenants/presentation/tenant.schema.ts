import { z } from 'zod';

export const createTenantSchema = z.object({
  name:                  z.string().min(1),
  chargerRange:          z.number().positive(),
  subscriptionExpiry:    z.coerce.date(),
  numberOfSubscriptions: z.number().int().positive(),
  numberOfEmployees:     z.number().int().positive(),
});

export type CreateTenantInput = z.infer<typeof createTenantSchema>;
