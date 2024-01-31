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
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export const InboxNav = () => {
  return (
    <nav className="flex flex-col justify-between w-[16rem] h-full border-r">
      <div className="flex flex-col">
        <div className="px-6 h-[64px] inline-flex gap-2 items-center border-b">
          <MailIcon className="w-7 h-7" />

          <span className="text-lg font-medium">Shrimp</span>
        </div>

        <Button
          variant="ghost"
          className="justify-start mt-3 px-4 mx-2 gap-2 text-muted-foreground"
        >
          <SquarePenIcon className="w-4 h-4" />
          Compose
        </Button>

        <Button
          variant="ghost"
          className="justify-start px-4 mx-2 gap-2 text-muted-foreground"
        >
          <SettingsIcon className="w-4 h-4" />
          Settings
        </Button>

        <Separator className="my-3" />
        <code className="text-muted-foreground px-6 mb-2 text-xs">MAIL</code>

        <Button variant="default" className="justify-start px-4 mx-2 gap-2">
          <InboxIcon className="w-4 h-4" />
          Inbox
        </Button>

        <Button
          variant="ghost"
          className="justify-start px-4 mx-2 gap-2 text-muted-foreground"
        >
          <SendIcon className="w-4 h-4" />
          Sent
        </Button>

        <Button
          variant="ghost"
          className="justify-start px-4 mx-2 gap-2 text-muted-foreground"
        >
          <NotebookPenIcon className="w-4 h-4" />
          Drafts
        </Button>

        <Button
          variant="ghost"
          className="justify-start px-4 mx-2 gap-2 text-muted-foreground"
        >
          <AlertCircleIcon className="w-4 h-4" />
          Spam
        </Button>

        <Button
          variant="ghost"
          className="justify-start px-4 mx-2 gap-2 text-muted-foreground"
        >
          <Trash2Icon className="w-4 h-4" />
          Trash
        </Button>

        <Separator className="my-3" />
        <code className="text-muted-foreground px-6 mb-2 text-xs">LABELS</code>

        <Button
          variant="ghost"
          className="justify-start px-4 mx-2 gap-2 text-muted-foreground"
        >
          <div className="w-2 h-2 rounded-full bg-red-400" />
          Important
        </Button>

        <Button
          variant="ghost"
          className="justify-start px-4 mx-2 gap-2 text-muted-foreground"
        >
          <div className="w-2 h-2 rounded-full bg-green-400" />
          Education
        </Button>

        <Button
          variant="ghost"
          className="justify-start px-4 mx-2 gap-2 text-muted-foreground"
        >
          <div className="w-2 h-2 rounded-full bg-indigo-400" />
          Work
        </Button>

        <Button
          variant="ghost"
          className="justify-start px-4 mx-2 gap-2 text-muted-foreground"
        >
          <div className="w-2 h-2 rounded-full bg-orange-400" />
          Favorites
        </Button>
      </div>

      <div className="w-full border-t z-1 px-6 py-4 flex gap-3 hover:bg-muted cursor-pointer transition-colors">
        <Avatar className="w-10 h-10">
          <AvatarImage src="https://github.com/filipkania.png" />
          <AvatarFallback delayMs={500}>FK</AvatarFallback>
        </Avatar>

        <div className="flex flex-col justify-center">
          <span className="text-sm font-medium leading-4">Filip Kania</span>
          <span className="text-muted-foreground text-xs">me@fkrq.xyz</span>
        </div>
      </div>
    </nav>
  );
};
