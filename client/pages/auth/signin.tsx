import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { API } from "@/lib/api.mjs";
import { SymbolIcon } from "@radix-ui/react-icons";
import { toast } from "sonner";

import { useAuth } from "@/lib/auth/AuthContext";
import type { APIError, SignInQuery } from "@/types/API";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";

const SignInPage = () => {
  const auth = useAuth();
  const router = useRouter();

  const signIn = useMutation({
    mutationFn: (data: { username: string; password: string }) => {
      return API.post<SignInQuery>("/login", data);
    },

    onSuccess: ({ data }) => {
      toast.dismiss();

      auth.setToken(data.token);
      router.push("/inbox");
    },

    onError: (error: AxiosError<APIError>) => {
      let message = error.message;
      if (error.response?.data.message) {
        message = error.response.data.message;
      }

      toast.error("Error", {
        description: message,
        duration: 5000,
      });
    },
  });

  return (
    <div className="flex h-screen">
      <NextSeo title="Log In" />

      <div className="absolute w-full overflow-hidden py-8 lg:relative lg:block lg:bg-zinc-900">
        <span className="mx-10 text-2xl font-semibold text-foreground lg:text-white">
          Shrimp
        </span>
      </div>

      <div className="container flex w-full max-w-[65rem] items-center justify-center">
        <form
          className="flex flex-col gap-3 sm:min-w-[25rem]"
          onSubmit={(e) => {
            e.preventDefault();

            const form = new FormData(e.currentTarget);
            const { username, password } = Object.fromEntries(form.entries());

            signIn.mutate({
              username: username.toString(),
              password: password.toString(),
            });
          }}
        >
          <div className="flex flex-col text-center lg:text-left">
            <span className="text-3xl font-semibold tracking-tight">
              Welcome back!
            </span>
            <span className="text-muted-foreground">
              Please sign in to your Shrimp account.
            </span>
          </div>

          <div>
            <Label>
              Your username
              <Input
                name="username"
                placeholder="pizza"
                autoComplete="username"
                required
              />
            </Label>
          </div>

          <div>
            <Label>
              Password
              <Input
                name="password"
                placeholder={"\u2022".repeat(5)}
                type="password"
                autoComplete="current-password"
                required
              />
            </Label>
          </div>

          <Button
            type="submit"
            className="mt-6 gap-2 transition-colors"
            disabled={signIn.isPending}
          >
            {signIn.isPending && <SymbolIcon className="animate-spin" />}
            Sign in
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SignInPage;
