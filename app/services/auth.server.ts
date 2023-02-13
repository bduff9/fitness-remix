import dns from 'dns';

import { Authenticator } from 'remix-auth';
import { GoogleStrategy, SocialsProvider, TwitterStrategy } from 'remix-auth-socials';
import type { Selectable } from 'kysely';
import type { User } from 'kysely-codegen';
import { redirect } from '@remix-run/node';
import type { VerifyEmailFunction } from 'remix-auth-email-link';
import { EmailLinkStrategy } from 'remix-auth-email-link';

import { sendLoginEmail } from './email.server';

import { sessionStorage } from '~/services/session.server';
import type { ValueOf } from '~/utils/types';
import { ADMIN, env } from '~/utils/constants.server';
import { db } from 'db';
import { splitFullName } from '~/utils/strings';

export const authenticator = new Authenticator<Selectable<User>>(sessionStorage);

const getCallback = (provider: ValueOf<typeof SocialsProvider>) =>
	`${env.PUBLIC_SITE_URL}/auth/${provider}/callback`;

const getUserByProfile = async (profileId: string) => {
	const account = await db
		.selectFrom('Account')
		.select('user_id')
		.where('provider_account_id', '=', profileId)
		.executeTakeFirst();

	if (account) {
		const user = await db
			.selectFrom('User')
			.selectAll()
			.where('User.id', '=', account.user_id)
			.executeTakeFirstOrThrow();

		return user;
	}

	return undefined;
};

const getOrCreateUser = async (
	emails: Array<string>,
	first_name: string,
	last_name: string,
	image?: string,
) => {
	let user = await db
		.selectFrom('User')
		.selectAll()
		.where('User.email', 'in', emails)
		.executeTakeFirst();

	if (!user) {
		if (!first_name || !last_name) {
			throw new Error('User not found, did you mean to register?');
		}

		const { id } = await db
			.insertInto('User')
			.values({
				email: emails[0],
				added_by: ADMIN,
				updated_by: ADMIN,
				email_verified: new Date(),
				first_name,
				last_name,
				name: `${first_name} ${last_name}`,
				image,
			})
			.returning('id')
			.executeTakeFirstOrThrow();

		user = await db
			.selectFrom('User')
			.selectAll()
			.where('User.id', '=', id)
			.executeTakeFirstOrThrow();
	}

	return user;
};

export const verifyEmailAddress: VerifyEmailFunction = async email => {
	const hostName = email.split('@')[1];

	if (!hostName) throw new Error(`Invalid email address: ${email}`);

	const addresses = await dns.promises.resolveMx(hostName);

	const validEmailServer = addresses?.every(address => address.exchange);

	if (!validEmailServer) throw new Error(`Invalid email server: ${hostName}`);
};

authenticator.use(
	new GoogleStrategy(
		{
			clientID: env.GOOGLE_ID,
			clientSecret: env.GOOGLE_SECRET,
			callbackURL: getCallback(SocialsProvider.GOOGLE),
		},
		async ({ profile }) => {
			const userFromAccount = await getUserByProfile(profile.id);

			if (userFromAccount) {
				return userFromAccount;
			}

			const user = await getOrCreateUser(
				profile.emails.map(email => email.value),
				profile.name.givenName,
				profile.name.familyName,
				profile.photos[0].value,
			);

			await db
				.insertInto('Account')
				.values({
					added_by: ADMIN,
					updated_by: ADMIN,
					user_id: user.id,
					provider_type: 'oauth',
					provider_id: SocialsProvider.GOOGLE,
					provider_account_id: profile.id,
					compound_id: profile.id,
				})
				.executeTakeFirstOrThrow();

			return user;
		},
	),
);

authenticator.use(
	new TwitterStrategy(
		{
			clientID: env.TWITTER_ID,
			clientSecret: env.TWITTER_SECRET,
			callbackURL: getCallback(SocialsProvider.TWITTER),
			includeEmail: true,
		},
		async ({ profile }) => {
			const userFromAccount = await getUserByProfile(`${profile.id}`);

			if (userFromAccount) {
				return userFromAccount;
			}

			const { email, name, profile_image_url_https } = profile;
			const [firstName, lastName] = splitFullName(name);

			console.log(profile);

			if (!email) throw redirect('/login?error=no-email');

			const user = await getOrCreateUser(
				[email],
				firstName,
				lastName,
				profile_image_url_https,
			);

			await db
				.insertInto('Account')
				.values({
					added_by: ADMIN,
					updated_by: ADMIN,
					user_id: user.id,
					provider_type: 'oauth',
					provider_id: SocialsProvider.TWITTER,
					provider_account_id: `${profile.id}`,
					compound_id: `${profile.id}`,
				})
				.executeTakeFirstOrThrow();

			return user;
		},
	),
);

authenticator.use(
	new EmailLinkStrategy(
		{
			callbackURL: '/auth/magic',
			secret: env.secret,
			sendEmail: sendLoginEmail,
			verifyEmailAddress,
		},
		// In the verify callback,
		// you will receive the email address, form data and whether or not this is being called after clicking on magic link
		// and you should return the user instance
		async ({ email, form }) => {
			try {
				const user = await getOrCreateUser(
					[email],
					form.get('first_name')?.toString() ?? '',
					form.get('last_name')?.toString() ?? '',
				);

				return user;
			} catch (error) {
				console.error('Failed to login user', error);
				throw error;
			}
		},
	),
);
