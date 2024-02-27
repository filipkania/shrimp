import { AppContext } from "@/src";

export const method = "GET";
export const route = "/mails";

export const handler = async (c: AppContext) => {
  const { limit, offset, query } = c.req.query();
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
		WHERE LOWER(subject) LIKE ?1 OR LOWER(from_address) LIKE ?1 OR LOWER(from_name) LIKE ?1
		ORDER BY received_at DESC
		LIMIT ?2 OFFSET ?3
	`);

  return c.json(
    (
      await stmt
        .bind(`%${(query ?? "").toLowerCase()}%`, limit ?? 15, offset ?? 0)
        .all()
    ).results
  );
};
