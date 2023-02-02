import type { LoaderArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { AuthorizationError } from 'remix-auth';

import { authenticator } from '~/services/auth.server';

export const loader = async ({ request, params }: LoaderArgs) => {
	if (!params.provider) {
		throw redirect('/login');
	}

	try {
		return await authenticator.authenticate(params.provider, request, {
			successRedirect: '/',
			throwOnError: true,
		});
	} catch (error) {
		// Because redirects work by throwing a Response, you need to check if the
		// caught error is a response and return it or throw it again
		if (error instanceof Response) return error;

		if (error instanceof AuthorizationError) {
			// here the error is related to the authentication process
			console.error('auth error', error);
			throw error;
		}

		// here the error is a generic error that another reason may throw
		console.error('generic error', error);
		throw error;
	}
};
