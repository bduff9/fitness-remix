import type { Selectable } from 'kysely';
import type { User } from 'kysely-codegen';
import type { SendEmailFunction } from 'remix-auth-email-link';

import getLoginEmail from '~/emails/login';
import type { BaseEmailProps } from '~/emails/partials';
import { sendSESEmail } from '~/services/aws.server';
import { EMAIL_SUBJECT_PREFIX, env } from '~/utils/constants.server';
import type { Email } from '~/utils/email';
import { renderMJML, getID } from '~/utils/email';
import type { EmailType } from '~/utils/types';
import { EmailTypes } from '~/utils/types';

const { domain } = env;

export type EmailView = 'html' | 'rawSubject' | 'text';

export type EmailNotAllowedLocals = {
	browserLink?: never;
	domain?: never;
	unsubscribeLink?: never;
};

type EmailLocals = Record<string, unknown> & EmailNotAllowedLocals;

export type GetEmail = (props: BaseEmailProps) => Email;

export const previewEmail = async (
	getEmail: GetEmail,
	view: EmailView,
	locals: EmailLocals,
): Promise<string> => {
	const result = getEmail({
		...locals,
		browserLink: `${domain}/api/email/${locals.emailID}`,
		domain: domain ?? '',
		unsubscribeLink: `${domain}/api/email/unsubscribe${
			typeof locals.sendTo === 'string'
				? `?email=${encodeURIComponent(locals.sendTo)}`
				: ''
		}`,
	});

	if (view === 'html') {
		const html = await renderMJML(result.element);

		return html;
	}

	return result[view];
};

type SendEmail = (
	props: {
		getEmail: GetEmail;
		type: EmailType;
	} & ({ bcc: string[]; to?: never } | { bcc?: never; to: string[] }),
) => Promise<void>;

const sendEmail: SendEmail = async ({ bcc, getEmail, to }): Promise<void> => {
	const emailID = getID();
	const emails = bcc ?? to;
	const { element, rawSubject, text } = getEmail({
		browserLink: `${domain}/api/email/${emailID}`,
		domain: domain ?? '',
		unsubscribeLink: `${domain}/api/email/unsubscribe${
			emails.length === 1 ? `?email=${encodeURIComponent(emails[0])}` : ''
		}`,
	});
	const html = await renderMJML(element);
	const subject = `${EMAIL_SUBJECT_PREFIX} ${rawSubject}`;

	await sendSESEmail(emails, subject, html, text);
};

export const sendLoginEmail: SendEmailFunction<Selectable<User>> = async ({
	domainUrl,
	emailAddress,
	magicLink,
	user,
}) => {
	const getEmail: GetEmail = args =>
		getLoginEmail({
			...args,
			email: emailAddress,
			host: domainUrl,
			url: magicLink,
			user: user ?? undefined,
		});

	await sendEmail({ getEmail, to: [emailAddress], type: EmailTypes.verification });
};
