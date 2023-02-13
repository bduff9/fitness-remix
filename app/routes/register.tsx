import type { ActionArgs } from '@remix-run/node';

import { authenticator } from '~/services/auth.server';

export { loader } from './login';

export const action = async ({ request }: ActionArgs) => {
	await authenticator.authenticate('email-link', request, {
		successRedirect: '/register',
		failureRedirect: '/register',
	});
};

export { default } from './login';
