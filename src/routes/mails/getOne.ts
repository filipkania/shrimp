import { AppContext } from "@/src";
import * as schema from "@/src/schema";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";

export const method = "GET";
export const route = "/mails/:id";

export const handler = async (c: AppContext) => {
	const db = drizzle(c.env.DB, { schema });
  const mailId = c.req.param("id");

	return c.json(
		await db.query.mails.findFirst({
      where: (mails) => eq(mails.id, parseInt(mailId)),
			with: {
				from: true,
			},
		})
	);
};
