import { Email as ParsedEmail } from "postal-mime";

export const postalMimeToEmail = (mail: ParsedEmail) => {
	return {
		fromName: mail.from.name,

		messageId: mail.messageId,
		references: mail.references,

		headers: mail.headers.reduce(
			(acc, curr) => ({
				...acc,
				[curr.key]: curr.value,
			}),
			{}
		),

		subject: mail.subject,

		text: mail.text,
		html: mail.html,
	};
};
