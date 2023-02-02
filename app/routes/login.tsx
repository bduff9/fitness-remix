import type { ActionArgs, LoaderArgs } from '@remix-run/node';
import { Form, Link, useLocation } from '@remix-run/react';
import type { FC } from 'react';
import { SocialsProvider } from 'remix-auth-socials';
import { typedjson, useTypedLoaderData } from 'remix-typedjson';

import { authenticator } from '~/services/auth.server';
import { sessionStorage } from '~/services/session.server';
import type { ValueOf } from '~/utils/types';

export const loader = async ({ request }: LoaderArgs) => {
	await authenticator.isAuthenticated(request, { successRedirect: '/' });
	const session = await sessionStorage.getSession(request.headers.get('Cookie'));

	return typedjson({
		magicLinkSent: session.has('auth:magiclink'),
		magicLinkEmail: session.get('auth:email'),
	});
};

export const action = async ({ request }: ActionArgs) => {
	await authenticator.authenticate('email-link', request, {
		successRedirect: '/login',
		failureRedirect: '/login',
	});
};

interface SocialButtonProps {
	provider: ValueOf<typeof SocialsProvider>;
	label: string;
}

const SocialButton: FC<SocialButtonProps> = ({ provider, label }) => (
	<Form action={`/auth/${provider}`} method="post">
		<button type="submit">{label}</button>
	</Form>
);

const Login: FC = () => {
	const { magicLinkSent, magicLinkEmail } = useTypedLoaderData<typeof loader>() ?? {};
	const location = useLocation();
	const isRegister = location.pathname === '/register';

	//TODO: add first name and last name

	return (
		<>
			<Form action="/login" method="post">
				{magicLinkSent ? (
					<p>
						Successfully sent magic link {magicLinkEmail ? `to ${magicLinkEmail}` : ''}
					</p>
				) : (
					<>
						<h1>{isRegister ? 'Register' : 'Log in to your account'}</h1>
						<div>
							<label htmlFor="email">Email address</label>
							<input id="email" type="email" name="email" required />
						</div>
						<button>Email a login link</button>
						{isRegister ? (
							<Link to="/login">Log in instead</Link>
						) : (
							<Link to="/register">Register instead</Link>
						)}
					</>
				)}
			</Form>
			<SocialButton provider={SocialsProvider.GOOGLE} label="Login with Google" />
			<SocialButton provider={SocialsProvider.TWITTER} label="Login with Twitter" />
		</>
	);
};

export default Login;
