import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NextSeo } from "next-seo";
import { useState, type FormEvent } from "react";

import { SymbolIcon } from "@radix-ui/react-icons";
import { API } from "@/lib/api";
import { APIError, LoginQuery } from "@/types/API";
import { useToast } from "@/components/ui/use-toast";

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.currentTarget);
    console.log(form.entries())
    const { username, password } = Object.fromEntries(form.entries());

    let user: LoginQuery;
    try {
      const { data } = await API.post("/login", {
        username,
        password,
      });

      console.log(data);
      user = data;
    } catch (err) {
      console.log(err)
      if (err?.response?.status === 401) {
        const { message }: APIError = err.response.data;

        toast({
          title: message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Something went wrong...",
          description: "Try again later.",
          variant: "destructive"
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
