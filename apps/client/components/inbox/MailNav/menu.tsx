import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth/AuthContext";
import { CheckIcon, LogOutIcon, MoonStarIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

export const NavMenu = () => {
  const { resolvedTheme, theme, setTheme } = useTheme();
  const { logout } = useAuth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="mx-2 my-4 flex items-center gap-2 rounded-lg px-4 py-2 outline-none hover:bg-muted">
        <Avatar className="h-9 w-9">
          <AvatarImage src="https://github.com/filipkania.png" />
          <AvatarFallback delayMs={500}>FK</AvatarFallback>
        </Avatar>

        <div className="flex flex-col break-words text-left [&>*]:line-clamp-1">
          <span className="text-sm font-medium leading-4">Filip Kania</span>
          <span className="text-xs text-muted-foreground">fkrq.xyz</span>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="min-w-[15rem]">
        <DropdownMenuLabel>My addresses</DropdownMenuLabel>

        <DropdownMenuItem className="cursor-pointer justify-between text-muted-foreground">
          asdf@fkrq.xyz
          <CheckIcon className="h-4 w-4" />
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            {resolvedTheme === "dark" ? (
              <MoonStarIcon className="mr-2 h-4 w-4" />
            ) : (
              <SunIcon className="mr-2 h-4 w-4" />
            )}
            Theme
          </DropdownMenuSubTrigger>

          <DropdownMenuSubContent>
            {["light", "dark", "system"].map((t) => (
              <DropdownMenuItem
                key={t}
                onClick={() => setTheme(t)}
                className="justify-between capitalize"
              >
                {t}
                {theme === t && <CheckIcon className="h-4 w-4" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuItem
          onClick={() => logout()}
          className="cursor-pointer text-red-500"
        >
          <LogOutIcon className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
