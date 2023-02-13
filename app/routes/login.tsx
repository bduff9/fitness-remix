import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faGoogle, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
		failureRedirect: '/login?error=Y',
	});
};

interface SocialButtonProps {
	colorClasses: string;
	icon: IconProp;
	label: string;
	provider: ValueOf<typeof SocialsProvider>;
}

const SocialButton: FC<SocialButtonProps> = ({ colorClasses, icon, provider, label }) => (
	<Form action={`/auth/${provider}`} className="mt-1" method="post">
		<button
			className={`${colorClasses} font-bold py-2 px-4 rounded w-full`}
			type="submit"
		>
			<FontAwesomeIcon size="sm" icon={icon} />
			<span className="pl-2">{label}</span>
		</button>
	</Form>
);

const Login: FC = () => {
	const { magicLinkSent, magicLinkEmail } = useTypedLoaderData<typeof loader>() ?? {};
	const location = useLocation();
	const isRegister = location.pathname === '/register';

	return (
		<div className="w-full max-w-xs mx-auto">
			{magicLinkSent ? (
				<p>Successfully sent magic link {magicLinkEmail ? `to ${magicLinkEmail}` : ''}</p>
			) : (
				<div className="bg-gray-300 shadow-md rounded px-8 pt-6 pb-8 my-4">
					<Form action={isRegister ? '/register' : '/login'} method="post">
						<div className="mb-4">
							<label
								className="block text-gray-700 text-sm font-bold mb-2"
								htmlFor="email"
							>
								Email
							</label>
							<input
								autoComplete="email"
								className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
								id="email"
								name="email"
								type="email"
								placeholder="Email"
								required
							/>
						</div>
						{isRegister && (
							<>
								<div className="mb-4">
									<label
										className="block text-gray-700 text-sm font-bold mb-2"
										htmlFor="first_name"
									>
										First Name
									</label>
									<input
										autoComplete="given-name"
										className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
										id="first_name"
										name="first_name"
										type="text"
										placeholder="First Name"
										required
									/>
								</div>
								<div className="mb-6">
									<label
										className="block text-gray-700 text-sm font-bold mb-2"
										htmlFor="last_name"
									>
										Last Name
									</label>
									<input
										autoComplete="family-name"
										className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
										id="last_name"
										name="last_name"
										type="text"
										placeholder="Last Name"
										required
									/>
								</div>
							</>
						)}
						<div className="flex items-center justify-between mb-4">
							<button
								className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
								type="submit"
							>
								{isRegister ? 'Register' : 'Login'}
							</button>
							<Link
								className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
								to={isRegister ? '/login' : '/register'}
							>
								{isRegister ? 'Login' : 'Register'} instead?
							</Link>
						</div>
					</Form>
					<SocialButton
						colorClasses="bg-red-500 hover:bg-red-700 text-white"
						icon={faGoogle}
						label="Login with Google"
						provider={SocialsProvider.GOOGLE}
					/>
					<SocialButton
						colorClasses="bg-blue-500 hover:bg-blue-700 text-white"
						icon={faTwitter}
						label="Login with Twitter"
						provider={SocialsProvider.TWITTER}
					/>
				</div>
			)}
			<p className="text-center text-gray-500 text-xs">
				&copy;2023 ASWNN. All rights reserved.
			</p>
		</div>
	);
};

export default Login;
