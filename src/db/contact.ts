import { InferModel, sql } from "drizzle-orm";
import { DrizzleD1Database } from "drizzle-orm/d1";
import { contacts } from "../schema";

type Contact = InferModel<typeof contacts, "insert">;

export default {
	/**
	 * Inserts a contact.
	 *
	 * @param data Contact to insert
	 * @return id ID of inserted Contact
	 */
	insert: async (db: DrizzleD1Database<any>, data: Contact) => {
		const result = await db
			.insert(contacts)
			.values(data)
			.onConflictDoUpdate({
				set: { name: sql`excluded.name` },
				target: contacts.address,
			})
			.returning({ id: contacts.id })
			.get();

		return result.id;
	},

	/**
	 * Inserts many contacts.
	 *
	 * @param data Array of Contacts
	 * @return IDs of inserted Contacts
	 */
	insertMany: async (db: DrizzleD1Database<any>, data: Contact[]) => {
		const result = await db
			.insert(contacts)
			.values(data)
			.onConflictDoUpdate({
				set: { name: sql`excluded.name` },
				target: contacts.address,
			})
			.returning({ id: contacts.id })
			.all();

		return result.map(({ id }) => id);
	},
};
