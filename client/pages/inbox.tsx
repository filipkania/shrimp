import { InboxNav } from "@/components/inbox/inbox-nav";
import { MailList } from "@/components/inbox/mail-list";
import { MailView } from "@/components/inbox/mail-view";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useHash } from "@/lib/useHash";
import { useMediaQuery, useToggle } from "@uidotdev/usehooks";

const Inbox = () => {
  const [selectedMail, setSelectedMail] = useHash();
  const [menuOpened, toggleMenu] = useToggle();

  const isMobile = useMediaQuery("(max-width: 1024px)");

  if (isMobile)
    return (
      <main className="h-[100dvh] w-full flex overflow-y-hidden">
        <Sheet open={menuOpened} onOpenChange={(x) => toggleMenu(x)}>
          <SheetContent side="left" className="!min-w-[90%] p-0 pt-1">
            <InboxNav />
          </SheetContent>
        </Sheet>

        <div className="flex flex-col">
          <MailList toggleMenu={toggleMenu} />
        </div>

        <Drawer
          open={!!selectedMail}
          onOpenChange={(o) => !o && setSelectedMail("")}
        >
          <DrawerContent>
            <MailView />
          </DrawerContent>
        </Drawer>
      </main>
    );

  return (
    <main className="h-[100dvh] w-full flex">
      <InboxNav />

      <ResizablePanelGroup
        className="!hidden lg:!flex h-full w-full"
        direction={"horizontal"}
      >
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
