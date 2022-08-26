import { z } from 'zod';

export const NewUserSchema = z.object({
  email: z.string().email(),
  password: z.string()
});
