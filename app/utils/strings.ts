export const splitFullName = (fullName: string) => {
	const [firstName, ...lastName] = fullName.split(' ');

	return [firstName, lastName.join(' ')];
};
