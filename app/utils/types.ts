export type ValueOf<T> = T[keyof T];

export const EmailTypes = {
	newUser: 'newUser',
	verification: 'verification',
} as const;
export type EmailType = keyof typeof EmailTypes;
