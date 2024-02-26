import { MenuIcon, SearchIcon } from "lucide-react";
import { Button } from "../../ui/button";
import { ScrollArea } from "../../ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "../../ui/tabs";
import { useMails } from "@/lib/api/useMails";
import {
  useDebounce,
  useIntersectionObserver,
  useToggle,
} from "@uidotdev/usehooks";
import { useEffect, useState } from "react";
import { useHash } from "@/lib/useHash";
import { Input } from "../../ui/input";
import { MailEntry } from "./entry";

type Props = {
  toggleMenu?: (_: boolean) => void;
};

export const MailList = ({ toggleMenu }: Props) => {
  const [searchShown, toggleSearch] = useToggle(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 250);

  const { data, isFetching, hasNextPage, fetchNextPage } =
    useMails(debouncedSearchQuery);
  const mails = data?.pages.flatMap((x) => x) || [];

  const [selectedMail, setSelectedMail] = useHash();

  const [ref, entry] = useIntersectionObserver({
    threshold: 0,
    root: null,
    rootMargin: "0px",
  });

  useEffect(() => {
    if (!entry?.isIntersecting || isFetching || !hasNextPage) return;

    fetchNextPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entry?.isIntersecting]);

  return (
    <>
      <div className="flex h-[58px] w-[100dvw] items-center justify-between border-b bg-background px-3 lg:w-full lg:px-6">
        <div className="flex items-center gap-1">
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
          </span>
        </div>

        <div className="flex gap-1">
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
          <div className="sticky top-0 z-10 border-b bg-background/70 px-6 py-2 backdrop-blur dark:bg-background/80">
            <div className="relative">
              <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />

              <Input
                placeholder="Search something here..."
                className="border-none pl-8 shadow-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.currentTarget.value)}
              />
            </div>
          </div>
        )}

        {mails.map((mail, i) => (
          <MailEntry
            data={mail}
            key={i}
            selected={Number(selectedMail) === mail.id}
            ref={i === mails.length - 8 ? ref : null}
            onClick={(e) => {
              e.preventDefault();
              setSelectedMail(mail.id.toString());
            }}
          />
        ))}
      </ScrollArea>
    </>
  );
};
