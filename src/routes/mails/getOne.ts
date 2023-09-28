import { AppContext } from "@/src";

export const method = "GET";
export const route = "/mails/:id";

export const handler = async (c: AppContext) => {
	const mailId = c.req.param("id");
	const stmt = c.env.DB.prepare(`
		SELECT
			mails.id AS id,
			address AS from_address,
			*
		FROM mails
		INNER JOIN contacts
		ON contacts.id = mails.from_id
		WHERE mails.id = ?
	`);

	return c.json(await stmt.bind(mailId).first());
};
