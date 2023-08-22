import { AppContext } from "..";

export const method = "GET";
export const route = "/me";

export const handler = (c: AppContext) => {
	return c.get("user");
};
