import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_SIMULATOR_URL: z.string().url().refine((url) => {
    if (process.env.NODE_ENV === 'production') {
      return !url.includes('localhost');
    }
    return true;
  }, { message: "Em produção, a URL do simulador não pode ser localhost." }),
});

export const env = envSchema.parse({
  NEXT_PUBLIC_SIMULATOR_URL: process.env.NEXT_PUBLIC_SIMULATOR_URL,
});