import {
	MjmlAll,
	MjmlAttributes,
	MjmlColumn,
	MjmlImage,
	MjmlSection,
	MjmlStyle,
	MjmlText,
} from '@faire/mjml-react';
import type { FC } from 'react';

export type BaseEmailProps = {
	browserLink: string;
	domain: string;
	unsubscribeLink: string;
};

export const EmailHeader: FC<Pick<BaseEmailProps, 'browserLink' | 'domain'>> = ({
	browserLink,
	domain,
}) => (
	<>
		<MjmlSection padding="0 0 15px 0" css-class="hide-for-browser">
			<MjmlColumn vertical-align="middle">
				<MjmlText align="left" font-size="15px" padding="0">
					<p style={{ textAlign: 'center', margin: '10px 0' }}>
						<span>Email not displaying correctly? </span>
						<a style={{ fontSize: '15px' }} href={browserLink} className="link">
							View it in your browser
						</a>
					</p>
				</MjmlText>
			</MjmlColumn>
		</MjmlSection>

		<MjmlSection
			background-repeat="no-repeat"
			background-size="100% 100%"
			background-url="{{ domain }}/bkgd-pitch.png"
			padding="25px 20px"
		>
			<MjmlColumn background-color="transparent">
				<MjmlImage
					align="center"
					alt="Football Image"
					border="none"
					src={`${domain}/football.png`}
					title="Football Image"
					width="150px"
				/>
			</MjmlColumn>
		</MjmlSection>
	</>
);

export const EmailStyles: FC = () => (
	<>
		<MjmlAttributes>
			<MjmlAll
				font-family="Roboto, Helvetica, Arial, sans-serif"
				color="#55575d"
				vertical-align="middle"
				text-align="center"
				background-color="#F4F4F4"
			/>
		</MjmlAttributes>
		<MjmlStyle inline>
			{`
			.container {
				max-width: 600px;
			}

			.link {
				font-family: Roboto Helvetica, Arial, sans-serif;
				text-decoration: none;
				font-size: 16px;
				color: #346df1;
			}

			.footerLink {
				font-size: 14px;
				color: #000000;
				text-decoration: none;
				color: #346df1;
			}`}
		</MjmlStyle>
	</>
);

export const EmailFooter: FC<Pick<BaseEmailProps, 'domain' | 'unsubscribeLink'>> = ({
	domain,
	unsubscribeLink,
}) => (
	<MjmlSection background-size="auto" padding="50px 0 20px 0" text-align="center">
		<MjmlColumn>
			<MjmlText align="center" line-height="10px" color="#000000" padding="0 20px 0 20px">
				<p>
					<a href="https://www.asitewithnoname.com" className="footerLink">
						asitewithnoname.com
					</a>
				</p>
				<p>
					<span className="footer" style={{ fontSize: '14px' }}>
						Chicago, IL USA
					</span>
				</p>
				<p>
					<a href={unsubscribeLink} className="footerLink">
						Unsubscribe
					</a>
					<span style={{ fontSize: '16px' }}> | </span>
					<a href={`${domain}/users/edit`} className="footerLink">
						Update Preferences
					</a>
				</p>
			</MjmlText>
		</MjmlColumn>
	</MjmlSection>
);
