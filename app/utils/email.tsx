import { render } from '@faire/mjml-react/utils/render';
import type { ReactElement } from 'react';
import { v4 as uuidv4 } from 'uuid';

export type Email = {
	element: () => ReactElement;
	rawSubject: string;
	text: string;
};

export const formatPreview = (previewText: string): string => {
	const PREVIEW_LENGTH = 200;
	const currentLength = previewText.length;
	let toAdd = PREVIEW_LENGTH - currentLength;
	let formatted = `${previewText}&nbsp;`;

	while (toAdd--) formatted += '&zwnj;&nbsp;';

	return formatted;
};

export const getID = (): string => uuidv4().replace(/-/g, '');

export const renderMJML = async (getEl: () => ReactElement): Promise<string> => {
	const { errors, html } = render(getEl());

	errors?.forEach((error): void => {
		console.error('Error when compiling MJML:', error);
	});

	return html;
};
