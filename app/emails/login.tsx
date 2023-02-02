import {
	Mjml,
	MjmlBody,
	MjmlButton,
	MjmlColumn,
	MjmlHead,
	MjmlPreview,
	MjmlSection,
	MjmlText,
	MjmlTitle,
} from '@faire/mjml-react';
import type { FC } from 'react';
import type { User } from 'kysely-codegen';

import type { BaseEmailProps } from './partials';
import { EmailFooter, EmailHeader, EmailStyles } from './partials';

import type { Email } from '~/utils/email';
import { formatPreview } from '~/utils/email';

type LoginEmailProps = BaseEmailProps & {
	email: string;
	host: string;
	url: string;
	user?: Pick<User, 'first_name' | 'last_name'>;
};

const loginSubject = ({ host }: LoginEmailProps): string => `Sign in to ${host}`;

const loginText = ({
	url,
	user,
}: LoginEmailProps): string => `Please visit ${url} to sign in as

${user ? `${user.first_name} ${user.last_name}` : ''}
{{ user.userEmail }}`;

const LoginEmail: FC<LoginEmailProps> = ({
	browserLink,
	domain,
	email,
	host,
	unsubscribeLink,
	url,
	user,
}) => (
	<Mjml owa="desktop">
		<MjmlHead>
			<MjmlTitle>{`Sign in to ${host}`}</MjmlTitle>
			<MjmlPreview>
				<span
					dangerouslySetInnerHTML={{
						__html: formatPreview(`Open this to finish your login to ${host}`),
					}}
				></span>
			</MjmlPreview>
			<EmailStyles />
		</MjmlHead>
		<MjmlBody>
			<EmailHeader browserLink={browserLink} domain={domain} />
			<MjmlSection padding="0" text-align="center">
				<MjmlColumn background-color="#ffffff" border-radius="0 0 10px 10px" width="100%">
					<MjmlText align="center" font-size="20px" padding="10px 25px 20px 25px">
						Click below to sign in as
					</MjmlText>
					<MjmlText align="center" padding="10px 10px 20px 10px" font-size="20px">
						{user && (
							<div>
								<strong>
									{user.first_name}&nbsp;{user.last_name}
								</strong>
							</div>
						)}
						<div style={{ textDecoration: 'none' }}>
							<strong>{email}</strong>
						</div>
					</MjmlText>
					<MjmlButton
						align="center"
						background-color="#15803d"
						href={url}
						border-radius="3px"
						border="none"
						color="#ffffff"
						font-weight="normal"
						inner-padding="13px 25px 13px 25px"
						padding="10px 50px 10px 50px"
						text-decoration="none"
						text-transform="none"
						vertical-align="middle"
						width="100%"
					>
						<span style={{ fontSize: '16px' }}>Sign in</span>
					</MjmlButton>
					<MjmlText align="center" color="#000000" padding="30px 25px 20px 25px">
						<span>If you did not request this email you can safely ignore it.</span>
					</MjmlText>
				</MjmlColumn>
			</MjmlSection>
			<EmailFooter domain={domain} unsubscribeLink={unsubscribeLink} />
		</MjmlBody>
	</Mjml>
);

const getLoginEmail = (props: LoginEmailProps): Email => ({
	element: () => <LoginEmail {...props} />,
	rawSubject: loginSubject(props),
	text: loginText(props),
});

export default getLoginEmail;
