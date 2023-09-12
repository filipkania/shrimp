import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth/AuthContext";
import { User2, UserCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo } from "react";

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
  const auth = useAuth();

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
    <div className="sticky left-0 top-0 z-50 h-14 w-full overflow-x-hidden border-b backdrop-blur-md">
      <div className="container flex h-full items-center justify-between">
        <Link
          href="/"
          className="text-lg font-semibold text-foreground transition hover:text-foreground/60"
        >
          Shrimp
        </Link>

        <nav className="flex items-center gap-6">
          {renderedRoutes}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <User2 className="h-5 w-5 text-foreground/60" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </div>
  );
};
