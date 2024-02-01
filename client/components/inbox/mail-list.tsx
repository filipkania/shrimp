import { SearchIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { ScrollArea } from "../ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { useMails } from "@/lib/api/useMails";
import { useIntersectionObserver } from "@uidotdev/usehooks";
import { useEffect } from "react";

type Props = {
  setSelectedMail: (_: number | null) => void;
}

export const MailList = ({ setSelectedMail }: Props) => {
  const { data, isFetching, hasNextPage, fetchNextPage } = useMails();
  const mails = data?.pages.flatMap((x) => x) || [];

  const [ref, entry] = useIntersectionObserver({
    threshold: 0,
    root: null,
    rootMargin: "0px",
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies:
  useEffect(() => {
    if (!entry?.isIntersecting || isFetching || !hasNextPage) return;

    fetchNextPage();
  }, [entry?.isIntersecting]);

  return (
    <>
      <div className="px-6 h-[58px] border-b flex justify-between items-center">
        <span className="text-lg font-medium">
          Inbox
          <span className="text-red-600/70 font-normal">&nbsp;&bull; 128</span>
        </span>

        <div className="inline-flex gap-1">
          <Button variant="ghost" size="icon">
            <SearchIcon className="w-4 h-4" />
          </Button>

          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread">Unread</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <ScrollArea className="h-[calc(100%-58px)] flex flex-col items-center">
        {mails.map((mail, i) => (
          // biome-ignore lint/a11y/useKeyWithClickEvents: TODO: add full a11y
          <div
            className="w-full border-b flex gap-3 px-6 py-4 items-start hover:bg-muted cursor-pointer"
            onClick={() => setSelectedMail(mail.id)}
            ref={i === mails.length - 2 ? ref : null}
            key={mail.id}
          >
            <Checkbox className="mt-1" />

            <div className="w-full">
              <div className="inline-flex w-full justify-between">
                <span className="text-md font-semibold">
                  {mail.from_name || mail.from_address}
                </span>

                <span className="text-sm text-muted-foreground">
                  {new Date(mail.received_at).toLocaleDateString()}
                </span>
              </div>

              <span className="text-sm line-clamp-2">
                {mail.subject || "No subject"}
              </span>

              <span className="text-sm text-muted-foreground line-clamp-2 break-all mt-1">
                {mail.text?.substring(0, 300)}
              </span>
            </div>
          </div>
        ))}
      </ScrollArea>
    </>
  );
};
