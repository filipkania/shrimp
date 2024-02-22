import { MenuIcon, SearchIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { ScrollArea } from "../ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { useMails } from "@/lib/api/useMails";
import { useDebounce, useIntersectionObserver, useToggle } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useHash } from "@/lib/useHash";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Input } from "../ui/input";

type Props = {
  toggleMenu?: (_: boolean) => void;
};

export const MailList = ({ toggleMenu }: Props) => {
  const [searchShown, toggleSearch] = useToggle(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 250);

  const { data, isFetching, hasNextPage, fetchNextPage } = useMails(debouncedSearchQuery);
  const mails = data?.pages.flatMap((x) => x) || [];

  const [selectedMail, setSelectedMail] = useHash();

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
      <div className="flex h-[58px] w-[100dvw] items-center justify-between border-b bg-background px-3 lg:w-full lg:px-6">
        <div className="inline-flex items-center gap-1">
          {toggleMenu && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toggleMenu(true)}
            >
              <MenuIcon className="h-4 w-4" />
            </Button>
          )}

          <span className="text-md font-medium">
            Inbox
            <span className="text-md font-normal text-red-600/70">
              &nbsp;&bull; 128
            </span>
          </span>
        </div>

        <div className="inline-flex gap-1">
          <Button variant="ghost" size="icon" onClick={() => toggleSearch()}>
            <SearchIcon className="h-4 w-4" />
          </Button>

          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread">Unread</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <ScrollArea className="flex h-[calc(100dvh-58px)] flex-col items-center overflow-y-hidden">
        {searchShown && (
          <label className="flex items-center gap-1 border-b px-6 py-2">
            <SearchIcon className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search something here..."
              className="border-none shadow-none px-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
            />
          </label>
        )}

        {mails.map((mail, i) => (
          // biome-ignore lint/a11y/useKeyWithClickEvents: TODO: add full a11y
          <div
            className={cn(
              "flex w-full cursor-pointer items-start gap-3 border-b px-6 py-4 hover:bg-muted",
              Number(selectedMail) === mail.id && "bg-muted"
            )}
            onClick={() => setSelectedMail(mail.id.toString())}
            ref={i === mails.length - 2 ? ref : null}
            key={mail.id}
          >
            {/* <Checkbox className="mt-1" /> */}

            <div className="w-full break-all">
              <div className="inline-flex w-full items-center justify-between">
                <Tooltip>
                  <TooltipTrigger>
                    <span className="flex items-center gap-2 pr-3 font-semibold">
                      <div className="min-h-1.5 min-w-1.5 rounded-full bg-blue-500 motion-safe:animate-pulse" />

                      {mail.from_name || mail.from_address}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <span>{mail.from_address}</span>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger>
                    <span className="min-w-fit text-sm text-muted-foreground">
                      {new Date(mail.received_at).toLocaleDateString()}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <span>{new Date(mail.received_at).toLocaleString()}</span>
                  </TooltipContent>
                </Tooltip>
              </div>

              <span className="line-clamp-2 text-sm">
                {mail.subject || "No subject"}
              </span>

              <span className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                {mail.text?.substring(0, 300)}
              </span>
            </div>
          </div>
        ))}
      </ScrollArea>
    </>
  );
};
