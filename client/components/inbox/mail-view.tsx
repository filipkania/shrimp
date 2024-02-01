import {
  AlertCircleIcon,
  ArchiveIcon,
  ClockIcon,
  ForwardIcon,
  MailboxIcon,
  MoreVerticalIcon,
  ReplyAllIcon,
  ReplyIcon,
  Trash2Icon,
} from "lucide-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ScrollArea } from "../ui/scroll-area";
import { useMail } from "@/lib/api/useMail";
import { useMemo } from "react";
import { sanitize } from "dompurify";

type Props = {
  selectedMail: number | null;
};

export const MailView = ({ selectedMail }: Props) => {
  const { data: mail } = useMail(selectedMail);

  const emailHtml = useMemo(() => {
    if (!mail?.html) return null;

    return sanitize(mail.html, {
      FORCE_BODY: true,
      FORBID_TAGS: ["style"],
      USE_PROFILES: { html: true },
    });
  }, [mail?.html]);

  if (!selectedMail || !mail)
    return (
      <div className="w-full h-full flex flex-col justify-center items-center gap-2 text-muted-foreground">
        <MailboxIcon className="w-24 h-24" />
        <span className="font-medium text-xl">No email selected.</span>
      </div>
    );

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-5 h-[58px] w-full inline-flex justify-between items-center border-b">
        <div className="inline-flex h-6 items-center gap-1">
          <Button size="icon" variant="ghost">
            <ArchiveIcon className="w-4 h-4" />
          </Button>

          <Button size="icon" variant="ghost">
            <Trash2Icon className="w-4 h-4" />
          </Button>

          <Button size="icon" variant="ghost">
            <AlertCircleIcon className="w-4 h-4" />
          </Button>

          <Separator orientation="vertical" />

          <Button size="icon" variant="ghost">
            <ClockIcon className="w-4 h-4" />
          </Button>
        </div>

        <div className="inline-flex h-6 items-center gap-1">
          <Button size="icon" variant="ghost">
            <ReplyIcon className="w-4 h-4" />
          </Button>

          <Button size="icon" variant="ghost">
            <ReplyAllIcon className="w-4 h-4" />
          </Button>

          <Button size="icon" variant="ghost">
            <ForwardIcon className="w-4 h-4" />
          </Button>

          <Separator orientation="vertical" />

          <Button size="icon" variant="ghost">
            <MoreVerticalIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="w-full border-b px-6 py-4 flex gap-4">
        <Avatar className="w-12 h-12">
          <AvatarImage />
          <AvatarFallback className="text-muted-foreground">
            {(mail.from_name || mail.from_address).substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex items-start w-full">
          <div className="flex flex-col">
            <span className="font-medium">
              {mail.from_name || mail.from_address}
            </span>

            <span className="text-sm">{mail.subject || "No subject"}</span>
            <span className="text-sm text-muted-foreground">
              Reply-To: <code>{mail.from_address}</code>
            </span>
          </div>
          <span className="ml-auto text-sm text-muted-foreground">
            {new Date(mail.received_at).toLocaleDateString()}
          </span>
        </div>
      </div>

      <ScrollArea className="h-full mailview">
        <div
          className="h-full w-full p-4"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: it's needed for email rendering
          dangerouslySetInnerHTML={{
            __html: `<base target="_blank"/>${emailHtml}`,
          }}
        />
      </ScrollArea>
    </div>
  );
};
