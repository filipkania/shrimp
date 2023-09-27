import type { PrevCaller, PromptObject } from "prompts";

type X<T> = T extends PrevCaller<any, any> ? never : T;
export type Answers = {
	[K in X<(typeof questionsList)[number]["name"]>]: string;
};

const questionsList = [
	{
		name: "domain",
		type: "text",
		message: "On which domain you want host Shrimp?",
		validate: (val) => !val.includes(" ") && val.includes("."),
	},
	{
		name: "test",
		type: "confirm",
		message: "Do you want to deploy frontend?",
		initial: true,
	},
] as const satisfies readonly PromptObject[];

export const questions = questionsList as unknown as PromptObject[];
