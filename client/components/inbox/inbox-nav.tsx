import {
  AlertCircleIcon,
  CheckIcon,
  InboxIcon,
  LogOutIcon,
  MailIcon,
  MoonStarIcon,
  NotebookPenIcon,
  SendIcon,
  SettingsIcon,
  SquarePenIcon,
  SunIcon,
  Trash2Icon,
} from "lucide-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "../ui/dropdown-menu";
import { useAuth } from "@/lib/auth/AuthContext";
import { useCompose } from "./compose-provider";
import { useTheme } from "next-themes";

export const InboxNav = () => {
  const { logout } = useAuth();
  const { setTheme, resolvedTheme, theme } = useTheme();
  const { open: openCompose, isOpen: composeOpened } = useCompose();

  return (
    <nav className="flex h-full w-full flex-col justify-between lg:w-[16rem] lg:border-r">
      <div className="flex flex-col">
        <div className="inline-flex h-[58px] items-center gap-2 border-b px-6">
          <MailIcon className="h-7 w-7" />

          <span className="text-lg font-medium">Shrimp</span>
        </div>

        <Button
          variant="ghost"
          className="mx-2 mt-3 justify-between gap-2 px-4 text-muted-foreground"
          onClick={() => openCompose(true)}
        >
          <div className="flex items-center gap-2">
            <SquarePenIcon className="h-4 w-4" />
            Compose
          </div>

          {composeOpened && (
            <div className="relative flex">
              <div className="h-1.5 w-1.5 rounded-full bg-orange-300" />
              <div className="absolute h-1.5 w-1.5 animate-ping rounded-full bg-orange-300" />
            </div>
          )}
        </Button>

        <Button
          variant="ghost"
          className="mx-2 justify-start gap-2 px-4 text-muted-foreground"
        >
          <SettingsIcon className="h-4 w-4" />
          Settings
        </Button>

        <Separator className="my-3" />
        <code className="mb-2 px-6 text-xs text-muted-foreground">MAIL</code>

        <Button variant="default" className="mx-2 justify-start gap-2 px-4">
          <InboxIcon className="h-4 w-4" />
          Inbox
        </Button>

        <Button
          variant="ghost"
          className="mx-2 justify-start gap-2 px-4 text-muted-foreground"
        >
          <SendIcon className="h-4 w-4" />
          Sent
        </Button>

        <Button
          variant="ghost"
          className="mx-2 justify-start gap-2 px-4 text-muted-foreground"
        >
          <NotebookPenIcon className="h-4 w-4" />
          Drafts
        </Button>

        <Button
          variant="ghost"
          className="mx-2 justify-start gap-2 px-4 text-muted-foreground"
        >
          <AlertCircleIcon className="h-4 w-4" />
          Spam
        </Button>

        <Button
          variant="ghost"
          className="mx-2 justify-start gap-2 px-4 text-muted-foreground"
        >
          <Trash2Icon className="h-4 w-4" />
          Trash
        </Button>

        <Separator className="my-3" />
        <code className="mb-2 px-6 text-xs text-muted-foreground">LABELS</code>

        <Button
          variant="ghost"
          className="mx-2 justify-start gap-2 px-4 text-muted-foreground"
        >
          <div className="h-2 w-2 rounded-full bg-red-400" />
          Important
        </Button>

        <Button
          variant="ghost"
          className="mx-2 justify-start gap-2 px-4 text-muted-foreground"
        >
          <div className="h-2 w-2 rounded-full bg-green-400" />
          Education
        </Button>

        <Button
          variant="ghost"
          className="mx-2 justify-start gap-2 px-4 text-muted-foreground"
        >
          <div className="h-2 w-2 rounded-full bg-indigo-400" />
          Work
        </Button>

        <Button
          variant="ghost"
          className="mx-2 justify-start gap-2 px-4 text-muted-foreground"
        >
          <div className="h-2 w-2 rounded-full bg-orange-400" />
          Favorites
        </Button>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger className="z-1 flex w-full cursor-pointer items-center gap-3 border-t px-6 py-4 transition-colors hover:bg-muted">
          <Avatar className="h-10 w-10">
            <AvatarImage src="https://github.com/filipkania.png" />
            <AvatarFallback delayMs={500}>FK</AvatarFallback>
          </Avatar>

          <div className="flex flex-col items-start justify-center">
            <span className="text-sm font-medium leading-4">Filip Kania</span>
            <span className="text-xs text-muted-foreground">fkrq.xyz</span>
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuLabel>My account</DropdownMenuLabel>
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
              {["Light", "Dark", "System"].map((t) => (
                <DropdownMenuItem
                  key={t}
                  onClick={() => setTheme(t.toLowerCase())}
                  className="justify-between"
                >
                  {t}{" "}
                  {theme === t.toLowerCase() && (
                    <CheckIcon className="h-4 w-4" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuItem
            onClick={() => logout()}
            className="min-w-[10rem] cursor-pointer text-red-500"
          >
            <LogOutIcon className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
};
