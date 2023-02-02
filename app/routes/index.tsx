import type { LoaderArgs } from '@remix-run/node';
import { Form } from '@remix-run/react';
import { typedjson, useTypedLoaderData } from 'remix-typedjson';

import { authenticator } from '~/services/auth.server';

export const loader = async ({ request }: LoaderArgs) => {
	const user = await authenticator.isAuthenticated(request, {
		failureRedirect: '/login',
	});

	return typedjson({ user });
};

const Index = () => {
	const { user } = useTypedLoaderData<typeof loader>();

	return (
		<div>
			<h1 className="text-4xl font-bold text-kinkyKoala-800 dark:text-kinkyKoala-200">
				{!user
					? 'Welcome to FiTr'
					: `Welcome to Fitr, ${user.first_name ?? user.name ?? ''}`}
			</h1>
			<ul className="list-disc px-10 text-sapphireBlue-900 dark:text-sapphireBlue-100">
				{!user && (
					<li>
						<a href="/login">Sign up / Login</a>
					</li>
				)}
				<li>Record vitals</li>
				<li>Workout</li>
				{!!user && (
					<>
						<li>My Account</li>
						<li>
							<Form action="/logout" method="post">
								<button type="submit">Logout</button>
							</Form>
						</li>
					</>
				)}
			</ul>
		</div>
	);
};

export default Index;
