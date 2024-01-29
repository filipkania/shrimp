import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, type FormEvent } from "react";

import { SymbolIcon } from "@radix-ui/react-icons";
// import { API } from "@/lib/api";
// import { APIError, SignInQuery } from "@/types/API";
import { toast } from "sonner";

// import { useAuth } from "@/lib/auth/AuthContext";
import { useRouter } from "next/router";

const SignInPage = () => {
	const [loading, setLoading] = useState(false);

	// const auth = useAuth();
	const router = useRouter();

	const handleSignIn = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);

		const form = new FormData(e.currentTarget);
		const { username, password } = Object.fromEntries(form.entries());

		toast.error("Something went wrong...", {
			description: "Try again later.",
			duration: 5000,
		});
		return;

		// let user: SignInQuery;
		// try {
		// 	const { data } = await API.post("/SignIn", {
		// 		username,
		// 		password,
		// 	});

		// 	user = data;
		// 	// auth.set({
		// 	// 	token: user.token,
		// 	// });

		// 	router.push("/");
		// } catch (err) {
		// 	// const error = err as AxiosError<APIError>;

		// 	if (error.response?.status === 401) {
		// 		const message = error.response.data.message;

		// 		toast.error(message);
		// 	} else {
		// 		toast.error("Something went wrong...", {
		// 			description: "Try again later.",
		// 		});
		// 	}
		// } finally {
		// 	setLoading(false);
		// }
	};

	return (
		<div className="flex h-screen">
			<div className="absolute w-full overflow-hidden py-8 lg:relative lg:block lg:bg-zinc-900">
				<span className="mx-10 text-2xl font-semibold text-foreground lg:text-white">Shrimp</span>
			</div>

			<div className="container flex w-full max-w-[65rem] items-center justify-center">
				<form className="flex flex-col gap-3 sm:min-w-[25rem]" onSubmit={handleSignIn}>
					<div className="flex flex-col text-center lg:text-left">
						<span className="text-3xl font-semibold tracking-tight">Welcome back!</span>
						<span className="text-muted-foreground">Please sign in to your Shrimp account.</span>
					</div>

					<div>
						<Label>
							Your username
							<Input name="username" placeholder="pizza" autoComplete="username" required />
						</Label>
					</div>

					<div>
						<Label>
							Password
							<Input name="password" placeholder={"\u2022".repeat(5)} type="password" autoComplete="current-password" required />
						</Label>
					</div>

					<Button type="submit" className="mt-6 gap-2 transition-colors" disabled={loading}>
						{loading && <SymbolIcon className="animate-spin" />}
						Sign in
					</Button>
				</form>
			</div>
		</div>
	);
};

export default SignInPage;
