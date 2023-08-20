import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NextSeo } from "next-seo";

const LoginPage = () => {
  return (
    <>
      <NextSeo title="Login" />

      <div className="flex h-screen">
        <div className="absolute w-full py-8 lg:relative lg:block lg:bg-zinc-900">
          <span className="mx-10 text-2xl font-semibold text-black lg:text-white">
            Shrimp
          </span>
        </div>

        <div className="container flex w-full max-w-[65rem] items-center justify-center">
          <div className="flex flex-col gap-3 sm:min-w-[25rem]">
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
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                placeholder="pizza"
                type="password"
                autoComplete="current-password"
              />
            </div>

            <Button className="mt-6">Sign in</Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
