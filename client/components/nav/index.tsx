import { cn } from "@/lib/utils";
import { ShrimpLogo } from "../ui/shrimp-logo";
import Link from "next/link";
import { buttonVariants } from "../ui/button";

type Props = {
  collapsed: boolean;
};

export const Nav = ({ collapsed }: Props) => {
  return (
    <nav
      className={cn(
        "px-4 py-4 flex flex-col h-full *:transition-all",
        collapsed && "items-center",
      )}
    >
      <Link href="/" className={cn("flex group gap-3 !h-max", buttonVariants({ variant: "ghost" }))}>
        <div className="min-w-10 min-h-10 h-10 bg-black/80 group-hover:bg-black/60 transition cursor-pointer flex justify-center items-center rounded-lg">
          <ShrimpLogo className="h-8 w-8 text-white" />
        </div>

        {!collapsed && (
          <div className="flex flex-col justify-center">
            <span className="font-medium text-md leading-4">Shrimp</span>
            <span className="text-sm text-muted-foreground font-normal">asdf@shrimp.fkrq.xyz</span>
          </div>
        )}
      </Link>
    </nav>
  );
};
