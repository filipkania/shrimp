import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NextSeo } from "next-seo";
import { useState, type FormEvent } from "react";

import { SymbolIcon } from "@radix-ui/react-icons";
import { API } from "@/lib/api";
import { APIError, LoginQuery } from "@/types/API";
import { useToast, dispatch } from "@/components/ui/use-toast";

import type { AxiosError } from "axios";
import { useAuth } from "@/lib/auth/AuthContext";
import { useRouter } from "next/router";

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const auth = useAuth();
  const router = useRouter();

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const { username, password } = Object.fromEntries(form.entries());

    let user: LoginQuery;
    try {
      const { data } = await API.post("/login", {
        username,
        password,
      });

      user = data;
      auth.set({
        token: user.token,
      });

      router.push("/");

      // dismiss all toasts
      dispatch({ type: "DISMISS_TOAST" });
    } catch (err) {
      const error = err as AxiosError<APIError>;

      if (error.response?.status === 401) {
        const message = error.response.data.message;

        toast({
          title: message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Something went wrong...",
          description: "Try again later.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NextSeo title="Login" />

      <div className="flex h-screen">
        <div className="absolute w-full overflow-hidden py-8 lg:relative lg:block lg:bg-zinc-900">
          <span className="mx-10 text-2xl font-semibold text-black dark:text-white lg:text-white">
            Shrimp
          </span>
        </div>

        <div className="container flex w-full max-w-[65rem] items-center justify-center">
          <form
            className="flex flex-col gap-3 sm:min-w-[25rem]"
            onSubmit={handleLogin}
          >
            <div className="flex flex-col text-center lg:text-left">
              <span className="text-3xl font-semibold tracking-tight">
                Welcome back!
              </span>
              <span className="text-muted-foreground">
                Please log in to your Shrimp account.
              </span>
            </div>

            <div>
              <Label htmlFor="username">Your username</Label>
              <Input
                name="username"
                placeholder="pizza"
                autoComplete="username"
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                name="password"
                placeholder="pizza"
                type="password"
                autoComplete="current-password"
                required
              />
            </div>

            <Button
              type="submit"
              className="mt-6 gap-2 transition-colors"
              disabled={loading}
            >
              {loading && <SymbolIcon className="animate-spin" />}
              Sign in
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
