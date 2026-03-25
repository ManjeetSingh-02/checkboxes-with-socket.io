// internal-imports
import { APP_CONFIG } from './constants.js';

// external-imports
import 'dotenv/config';
import z from 'zod';

// zod schema for environment variables
const envSchema = z.object({
  PORT: z.coerce.number().int().positive(),
  NODE_ENV: z.enum(Object.values(APP_CONFIG.NODE_ENVS)),
  REDIS_HOST: z.string().trim().nonempty(),
  REDIS_PORT: z.coerce.number().int().positive(),
});

// function to validate environment variables
function validateEnv() {
  try {
    // parse environment variables
    return envSchema.parse(process.env);
  } catch (error: unknown) {
    // if zod error, format and throw a new error with all issues
    if (error instanceof z.ZodError)
      throw new Error(
        error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`).join('\n'),
        { cause: error }
      );

    // if it's not a zod error, rethrow it
    throw error;
  }
}

// export the validated environment variables
export const env = validateEnv();
