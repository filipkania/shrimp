import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth/AuthContext";
import { LogOut, User2 } from "lucide-react";
import { ThemeDropdown } from "./ThemeDropdown";

export const AccountDropdown = () => {
  const auth = useAuth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <User2 className="h-5 w-5 text-foreground/60" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem className="gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300">
            <User2 className="text-gray-500" />
          </div>

          <div className="flex flex-col justify-center">
            <span>
              {auth.user?.username || (
                <Skeleton className="h-[15px] w-[70px] rounded" />
              )}
            </span>
            <span className="text-xs text-gray-700 dark:text-gray-300">User</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        <ThemeDropdown />

        <DropdownMenuItem
          onClick={auth.logout}
          className="cursor-pointer text-red-500"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
