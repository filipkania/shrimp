import { AppContext } from "@/src";

export const method = "GET";
export const route = "/mails";

export const handler = async (c: AppContext) => {
	const { limit, offset } = c.req.query();
	const stmt = c.env.DB.prepare(`
		SELECT
			mails.id AS id,
			from_name,
			address AS from_address,
			subject,
			SUBSTR(text, 0, 250) AS text,
			received_at
		FROM mails
		INNER JOIN contacts
		ON contacts.id = mails.from_id
		ORDER BY received_at DESC
		LIMIT ? OFFSET ?
	`);

	return c.json((await stmt.bind(limit ?? 15, offset ?? 0).all()).results);
};
