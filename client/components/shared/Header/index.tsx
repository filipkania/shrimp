import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { AccountDropdown } from "./AccountDropdown";
import { cn } from "@/lib/utils";

export const routes = [
  {
    name: "Inbox",
    href: "/",
    exact: true,
  },
  {
    name: "Contacts",
    href: "/contacts",
  },
];

const buttonStyles = {
  default: "text-sm text-foreground/60 transition hover:text-foreground/80",
  active: "text-sm text-foreground transition hover:text-foreground/80",
};

export const Header = () => {
  const router = useRouter();

  const renderedRoutes = useMemo(() => {
    return routes.map(({ name, href, exact }, key) => {
      const isMatch = exact
        ? router.pathname === href
        : router.pathname.startsWith(href);

      return (
        <Link
          key={key}
          href={href}
          className={buttonStyles[isMatch ? "active" : "default"]}
        >
          {name}
        </Link>
      );
    });
  }, [router]);

  return (
    <div
      className={cn(
        "sticky left-0 top-0 z-50 h-14 w-full overflow-x-hidden bg-white/[0.6] dark:bg-black/[.5] border-b backdrop-blur-md",
        router.pathname === "/auth/login" && "hidden"
      )}
    >
      <div className="container flex h-full items-center justify-between">
        <Link
          href="/"
          className="text-lg font-semibold text-foreground transition hover:text-foreground/60"
        >
          Shrimp
        </Link>

        <nav className="flex items-center gap-6">
          {renderedRoutes}

          <AccountDropdown />
        </nav>
      </div>
    </div>
  );
};
