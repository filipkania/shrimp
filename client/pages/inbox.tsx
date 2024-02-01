import { InboxNav } from "@/components/inbox/inbox-nav";
import { MailList } from "@/components/inbox/mail-list";
import { MailView } from "@/components/inbox/mail-view";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";


const Inbox = () => {
  return (
    <main className="h-screen w-full flex">
      <InboxNav />

      <ResizablePanelGroup className="h-full w-full" direction={"horizontal"}>
        <ResizablePanel className="min-w-[24rem]" minSize={20}>
          <MailList />
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel minSize={40}>
          <MailView />
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
};

export default Inbox;
