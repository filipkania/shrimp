import { SearchIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { ScrollArea } from "../ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

export const MailList = () => {
  return (
    <>
      <div className="px-6 h-[58px] w-full border-b flex justify-between items-center">
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

      <ScrollArea className="h-[calc(100%-58px)] flex flex-col gap-3 items-center">
        {new Array(66).fill(0).map((_, i) => (
          <div
            className="w-full border-b flex gap-3 px-6 py-4 items-start hover:bg-muted cursor-pointer"
            key={i}
          >
            <Checkbox className="mt-2" />

            <div className="w-full">
              <div className="inline-flex w-full justify-between">
                <div className="flex flex-col">
                  <span className="text-md font-semibold">Filip Kania</span>

                  <span className="text-sm">Meeting details</span>
                </div>

                <span className="text-sm text-muted-foreground">
                  12/01/2024
                </span>
              </div>

              <span className="text-sm text-muted-foreground line-clamp-2 mt-1">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dolore
                voluptatum molestiae adipisci sequi blanditiis distinctio eos,
                quam voluptatibus asperiores culpa veniam assumenda mollitia
                nobis minus neque, totam quaerat autem deleniti!
              </span>
            </div>
          </div>
        ))}
      </ScrollArea>
    </>
  );
};
