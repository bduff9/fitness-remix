import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses';

import { env } from '~/utils/constants.server';

const {
	AWS_AK_ID: accessKeyId,
	AWS_R: region,
	AWS_SAK_ID: secretAccessKey,
	EMAIL_FROM,
} = env;
const ses = new SESClient({ region, credentials: { accessKeyId, secretAccessKey } });
const Charset = 'UTF-8';

export const sendSESEmail = async (
	recipientEmail: Array<string>,
	subject: string,
	html: string,
	text: string,
) => {
	const command = new SendEmailCommand({
		Destination: {
			ToAddresses: recipientEmail,
		},
		Message: {
			Body: {
				Html: {
					Charset,
					Data: html,
				},
				Text: {
					Charset,
					Data: text,
				},
			},
			Subject: {
				Charset,
				Data: subject,
			},
		},
		Source: EMAIL_FROM,
	});

	const res = await ses.send(command);

	return res;
};
