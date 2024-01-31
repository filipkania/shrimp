import { InboxNav } from "@/components/inbox-nav";
import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertCircleIcon,
  ArchiveIcon,
  ClockIcon,
  ForwardIcon,
  MoreVerticalIcon,
  ReplyAllIcon,
  ReplyIcon,
  Trash2Icon,
} from "lucide-react";

const Inbox = () => {
  return (
    <main className="h-screen w-full flex">
      <InboxNav />

      <ResizablePanelGroup className="h-full w-full" direction={"horizontal"}>
        <ResizablePanel minSize={20}>
          <div className="px-6 h-[64px] w-full border-b flex justify-between items-center">
            <span className="text-lg font-medium">
              Inbox&nbsp;
              <span className="text-red-600/70 font-normal">&bull; 128</span>
            </span>

            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="unread">Unread</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <ScrollArea className="h-[calc(100%-64px)] flex flex-col px-6 py-4 gap-3">
            {new Array(66).fill(0).map((i) => (
              <div className="w-full border rounded-md" key={i}>
                {i}
              </div>
            ))}
          </ScrollArea>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel minSize={40}>
          <div className="px-6 py-5 h-[64px] w-full inline-flex justify-between items-center border-b">
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
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
};

export default Inbox;
