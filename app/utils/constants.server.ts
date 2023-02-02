import type { TypeOf } from 'zod';
import { z } from 'zod';

const withDevDefault = <T extends z.ZodTypeAny>(schema: T, val: TypeOf<T>) =>
	process.env['NODE_ENV'] !== 'production' ? schema.default(val) : schema;

const schema = z.object({
	AWS_AK_ID: z.string(),
	AWS_R: withDevDefault(z.string(), 'us-east-1'),
	AWS_SAK_ID: z.string(),
	DATABASE_URL: withDevDefault(z.string().url(), ''),
	domain: withDevDefault(z.string().url(), 'http://localhost:3000'),
	EMAIL_FROM: z.string(),
	GOOGLE_ID: z.string(),
	GOOGLE_SECRET: z.string(),
	NODE_ENV: z.enum(['development', 'production']),
	PUBLIC_SITE_URL: withDevDefault(z.string().url(), 'http://localhost:3000'),
	secret: withDevDefault(z.string(), 's3cr3t'),
	TWITTER_ID: z.string(),
	TWITTER_SECRET: z.string(),
});

export const env = schema.parse(process.env);

/**
 * User name used by system
 */
export const ADMIN = 'ADMIN';

/**
 * Prefix used for all communications
 */
export const EMAIL_SUBJECT_PREFIX = '[FiTr] ';
