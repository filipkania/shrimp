import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NextSeo } from "next-seo";
import { useState, type FormEvent } from "react";

import { SymbolIcon } from "@radix-ui/react-icons";
import { queryAPI } from "@/lib/useAPI";
import { LoginQuery } from "@/types/API";
import { useAuth } from "@/lib/auth/AuthContext";
import { useRouter } from "next/router";

const LoginPage = () => {
  const auth = useAuth();
  const router = useRouter();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    queryAPI()
      .url("/api/login")
      .post({
        "username": "ASDf"
      })
      // .finally(() => setLoading(false));
  };

  return (
    <>
      <NextSeo title="Login" />

      <div className="flex h-screen">
        <div className="absolute w-full py-8 lg:relative lg:block lg:bg-zinc-900">
          <span className="mx-10 text-2xl font-semibold text-black dark:text-white lg:text-white">
            Shrimp
          </span>
        </div>

        <div className="container flex w-full max-w-[65rem] items-center justify-center">
          <form
            className="flex flex-col gap-3 sm:min-w-[25rem]"
            onSubmit={handleSubmit}
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
                id="username"
                placeholder="pizza"
                autoComplete="username"
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
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

            {error && (
              <span className="mt-2 text-center text-red-500">{error}</span>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
