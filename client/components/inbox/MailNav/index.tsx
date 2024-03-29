import {
  AlertCircleIcon,
  InboxIcon,
  MailIcon,
  NotebookPenIcon,
  SendIcon,
  SettingsIcon,
  SquarePenIcon,
  Trash2Icon,
} from "lucide-react";
import { Button } from "../../ui/button";
import { Separator } from "../../ui/separator";
import { useCompose } from "../compose-provider";
import { NavMenu } from "./menu";

export const InboxNav = () => {
  const { open: openCompose, isOpen: composeOpened } = useCompose();

  return (
    <nav className="flex h-full w-full flex-col justify-between lg:w-[16rem] lg:border-r">
      <div className="flex flex-col">
        <div className="flex h-[58px] items-center gap-2 border-b px-6">
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
              <div className="absolute h-1.5 w-1.5 rounded-full bg-orange-300 motion-safe:animate-ping" />
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

        <Button
          variant="default"
          className="mx-2 items-center justify-between gap-2 px-4"
        >
          <div className="flex items-center gap-2">
            <InboxIcon className="h-4 w-4" />
            Inbox
          </div>

          <span className="text-xs text-muted-foreground">
            3 <span className="sr-only">unread mails</span>
          </span>
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

      <NavMenu />
    </nav>
  );
};
