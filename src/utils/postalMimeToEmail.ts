import type { Email as ParsedEmail } from "postal-mime";

export const postalMimeToEmail = (mail: ParsedEmail) => {
	const headers = mail.headers.reduce((acc, curr) => {
		if (curr.key.length > 5120 || curr.value.length > 5120)  // header limit: 5KB
			return acc;

		return {
			...acc,
			[curr.key]: curr.value,
		};
	}, {});

	return {
		from_name: mail.from.name,

		message_id: mail.messageId,
		references: mail.references,

		headers: JSON.stringify(headers),

		subject: mail.subject,

		text: mail.text,
		html: mail.html,
	};
};
