import { customType } from "drizzle-orm/sqlite-core";

export const JSONType = <TData>(name: string) =>
	customType<{ data: TData; driverData: string }>({
		dataType() {
			return "text";
		},
		toDriver(value: TData): string {
			return JSON.stringify(value);
		},
		fromDriver(value: string): TData {
			return JSON.parse(value);
		},
	})(name);
