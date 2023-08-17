import { customType } from "drizzle-orm/sqlite-core";

export const JSONType = <TData>(name: string) =>
	customType<{ data: TData; driverData: string }>({
		dataType: () => "text",
		toDriver: (value) => JSON.stringify(value),
		fromDriver: (value) => JSON.parse(value),
	})(name);
