import type { Kysely } from 'kysely';
import { sql } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
	// User
	await db.schema
		.createTable('User')
		.addColumn('id', 'serial', col => col.primaryKey())
		.addColumn('email', 'varchar(200)', col => col.unique().notNull())
		.addColumn('name', 'varchar(200)')
		.addColumn('first_name', 'varchar(50)')
		.addColumn('last_name', 'varchar(50)')
		.addColumn('image', 'varchar(250)')
		.addColumn('email_verified', 'timestamp')
		.addColumn('is_admin', 'boolean', col => col.defaultTo(false).notNull())
		.addColumn('is_opted_out', 'boolean', col => col.defaultTo(false).notNull())
		.addColumn('added', 'timestamp', col => col.defaultTo(sql`now()`).notNull())
		.addColumn('added_by', 'varchar(50)', col => col.notNull())
		.addColumn('updated', 'timestamp', col => col.defaultTo(sql`now()`).notNull())
		.addColumn('updated_by', 'varchar(50)', col => col.notNull())
		.addColumn('deleted', 'timestamp')
		.addColumn('deleted_by', 'varchar(50)')
		.execute();
	// Account
	await db.schema
		.createTable('Account')
		.addColumn('id', 'serial', col => col.primaryKey())
		.addColumn('compound_id', 'varchar(250)', col => col.unique().notNull())
		.addColumn('user_id', 'integer', col => col.references('User.id').notNull())
		.addColumn('provider_type', 'varchar(250)', col => col.notNull())
		.addColumn('provider_id', 'varchar(250)', col => col.notNull())
		.addColumn('provider_account_id', 'varchar(250)', col => col.notNull())
		.addColumn('refresh_token', 'text')
		.addColumn('access_token', 'text')
		.addColumn('access_token_expires', 'timestamp')
		.addColumn('added', 'timestamp', col => col.defaultTo(sql`now()`).notNull())
		.addColumn('added_by', 'varchar(50)', col => col.notNull())
		.addColumn('updated', 'timestamp', col => col.defaultTo(sql`now()`).notNull())
		.addColumn('updated_by', 'varchar(50)', col => col.notNull())
		.addColumn('deleted', 'timestamp')
		.addColumn('deleted_by', 'varchar(50)')
		.execute();
	// Session
	await db.schema
		.createTable('Session')
		.addColumn('id', 'serial', col => col.primaryKey())
		.addColumn('user_id', 'integer', col => col.references('User.id').notNull())
		.addColumn('expires', 'timestamp', col => col.defaultTo(sql`now()`).notNull())
		.addColumn('token', 'varchar(250)', col => col.unique().notNull())
		.addColumn('access_token', 'varchar(250)', col => col.unique().notNull())
		.addColumn('added', 'timestamp', col => col.defaultTo(sql`now()`).notNull())
		.addColumn('added_by', 'varchar(50)', col => col.notNull())
		.addColumn('updated', 'timestamp', col => col.defaultTo(sql`now()`).notNull())
		.addColumn('updated_by', 'varchar(50)', col => col.notNull())
		.addColumn('deleted', 'timestamp')
		.addColumn('deleted_by', 'varchar(50)')
		.execute();
	// VerificationRequest
	await db.schema
		.createTable('VerificationRequest')
		.addColumn('id', 'serial', col => col.primaryKey())
		.addColumn('identifier', 'varchar(255)', col => col.notNull())
		.addColumn('token', 'varchar(250)', col => col.unique().notNull())
		.addColumn('expires', 'timestamp', col => col.defaultTo(sql`now()`).notNull())
		.addColumn('added', 'timestamp', col => col.defaultTo(sql`now()`).notNull())
		.addColumn('added_by', 'varchar(50)', col => col.notNull())
		.addColumn('updated', 'timestamp', col => col.defaultTo(sql`now()`).notNull())
		.addColumn('updated_by', 'varchar(50)', col => col.notNull())
		.addColumn('deleted', 'timestamp')
		.addColumn('deleted_by', 'varchar(50)')
		.execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
	await db.schema.dropTable('User').execute();
	await db.schema.dropTable('Account').execute();
	await db.schema.dropTable('Session').execute();
	await db.schema.dropTable('VerificationRequest').execute();
}
