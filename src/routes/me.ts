import { AppContext } from "..";

export const method = "GET";
export const route = "/me";

export const handler = async (c: AppContext) => {
	return c.json(c.get("user"));
};
