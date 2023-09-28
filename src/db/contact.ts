export type Contact = {
	id: number;
	name: string;
	address: string;
};

export default {
	/**
	 * Inserts a contact.
	 *
	 * @param data Contact to insert
	 * @return id ID of inserted Contact
	 */
	insert: async (db: D1Database, data: Omit<Contact, "id">) => {
		const { name, address } = data;

		const stmt = await db
			.prepare("INSERT INTO contacts(name, address) VALUES (?, ?) ON CONFLICT(address) DO UPDATE SET name = excluded.name RETURNING *;")
			.bind(name, address)
			.run();

		return (stmt.results as Contact[])[0].id;
	},

	/**
	 * Inserts many contacts.
	 *
	 * @param data Array of Contacts
	 * @return IDs of inserted Contacts
	 */
	insertMany: async (db: D1Database, data: Omit<Contact, "id">[]) => {
		const stmt = db.prepare(
			"INSERT INTO contacts(name, address) VALUES (?, ?) ON CONFLICT(address) DO UPDATE SET name = excluded.name RETURNING *;"
		);

		const batch = await db.batch(data.map(({ name, address }) => stmt.bind(name, address)));

		return batch.map((query) => (query.results as Contact[])[0].id);
	},
};
