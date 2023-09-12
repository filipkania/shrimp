import { AppContext } from "@/src";
import * as schema from "@/src/schema";
import { drizzle } from "drizzle-orm/d1";

export const method = "GET";
export const route = "/mails";

export const handler = async (c: AppContext) => {
	const db = drizzle(c.env.DB, { schema });

	return c.json(await db.query.mails.findMany());
};
