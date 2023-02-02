import { createCookieSessionStorage } from '@remix-run/node';

import { env } from '~/utils/constants.server';

export const sessionStorage = createCookieSessionStorage({
	cookie: {
		name: '_session', // use any name you want here
		sameSite: 'lax', // this helps with CSRF
		path: '/', // remember to add this so the cookie will work in all routes
		httpOnly: true, // for security reasons, make this cookie http only
		secrets: [env.secret], // replace this with an actual secret
		secure: env.NODE_ENV === 'production', // enable this in prod only
	},
});
