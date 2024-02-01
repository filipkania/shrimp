import { InboxNav } from "@/components/inbox/inbox-nav";
import { MailList } from "@/components/inbox/mail-list";
import { MailView } from "@/components/inbox/mail-view";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useState } from "react";


const Inbox = () => {
  const [selectedMail, setSelectedMail] = useState<number | null>(null);

  return (
    <main className="h-screen w-full flex">
      <InboxNav />

      <ResizablePanelGroup className="h-full w-full" direction={"horizontal"}>
        <ResizablePanel className="min-w-[24rem]" minSize={20}>
          <MailList selectedMail={selectedMail} setSelectedMail={setSelectedMail} />
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel minSize={40}>
          <MailView selectedMail={selectedMail} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
};

export default Inbox;
