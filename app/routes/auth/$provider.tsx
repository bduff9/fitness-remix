import type { ActionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';

import { authenticator } from '~/services/auth.server';

export const loader = () => redirect('/login');

export const action = ({ request, params }: ActionArgs) => {
	if (!params.provider) {
		throw redirect('/login');
	}

	return authenticator.authenticate(params.provider, request);
};
