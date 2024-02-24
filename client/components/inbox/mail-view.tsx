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
import { useHash } from "@/lib/useHash";
import { useMediaQuery } from "@uidotdev/usehooks";
import { cn } from "@/lib/utils";
import { NextSeo } from "next-seo";

export const MailView = () => {
  const [selectedMail] = useHash();
  const { data: mail } = useMail(selectedMail);
  const isMobile = useMediaQuery("(max-width: 1024px)");

  const emailHtml = useMemo(() => {
    if (!mail?.html) return null;

    const sanitizedHTML = sanitize(mail.html, {
      FORCE_BODY: true,
      FORBID_TAGS: ["style", "form", "input", "base"],
      USE_PROFILES: { html: true },
    });

    return (
      <div
        className="mailview bg-white text-black min-w-fit p-4 md:p-8"
        dangerouslySetInnerHTML={{
          __html: `<base target="_blank" />${sanitizedHTML}`,
        }}
      />
    );
  }, [mail?.html]);

  if (!selectedMail || !mail)
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground">
        <NextSeo title="Inbox" />

        <MailboxIcon className="h-24 w-24" />
        <span className="text-xl font-medium">No email selected.</span>
      </div>
    );

  return (
    <div className="flex h-full flex-col">
      <NextSeo title={mail.subject || "No Subject"} />

      <div className="inline-flex h-[58px] w-full items-center justify-between border-b px-6 py-5">
        <div className="inline-flex h-6 items-center gap-1">
          <Button size="icon" variant="ghost">
            <ArchiveIcon className="h-4 w-4" />
          </Button>

          <Button size="icon" variant="ghost">
            <Trash2Icon className="h-4 w-4" />
          </Button>

          <Button size="icon" variant="ghost">
            <AlertCircleIcon className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" />

          <Button size="icon" variant="ghost">
            <ClockIcon className="h-4 w-4" />
          </Button>
        </div>

        <div className="inline-flex h-6 items-center gap-1">
          <Button size="icon" variant="ghost">
            <ReplyIcon className="h-4 w-4" />
          </Button>

          <Button size="icon" variant="ghost">
            <ReplyAllIcon className="h-4 w-4" />
          </Button>

          <Button size="icon" variant="ghost">
            <ForwardIcon className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" />

          <Button size="icon" variant="ghost">
            <MoreVerticalIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div
        className={cn(
          isMobile && "w-full overflow-y-auto",
          "flex h-[calc(100dvh-58px)] flex-col"
        )}
      >
        <div
          className={cn(
            "flex gap-4 border-b px-6 py-4",
            isMobile && "sticky left-0 bg-background"
          )}
        >
          <Avatar className="h-12 w-12">
            <AvatarImage />
            <AvatarFallback className="text-muted-foreground">
              {(mail.from_name || mail.from_address)
                .substring(0, 2)
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex w-full flex-col break-all">
            <div className="flex w-full items-center justify-between">
              <span className="p-0 font-medium">
                {mail.from_name || mail.from_address}
              </span>

              <span className="ml-auto min-w-fit text-sm text-muted-foreground">
                {new Date(mail.received_at).toLocaleString()}
              </span>
            </div>

            <span className="text-sm text-muted-foreground">
              From: <code>{mail.from_address}</code>
            </span>

            <span className="text-sm">{mail.subject || "No subject"}</span>
          </div>
        </div>

        {isMobile ? (
          emailHtml
        ) : (
          <ScrollArea orientation="both">{emailHtml}</ScrollArea>
        )}
      </div>
    </div>
  );
};
