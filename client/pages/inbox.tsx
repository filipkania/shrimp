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

  const renderedMailList = <MailList toggleMenu={toggleMenu} />;
  const renderedMailView = <MailView />;

  return (
    <main className="h-screen w-full flex">
      {isMobile ? (
        <Sheet open={menuOpened} onOpenChange={(x) => toggleMenu(x)}>
          <SheetContent side="left" className="!min-w-[90%] p-0 pt-1">
            <InboxNav toggleMenu={toggleMenu} />
          </SheetContent>
        </Sheet>
      ) : (
        <InboxNav />
      )}

      <ResizablePanelGroup
        className="!hidden lg:!flex h-full w-full"
        direction={"horizontal"}
      >
        <ResizablePanel className="min-w-[24rem]" minSize={20}>
          {renderedMailList}
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel minSize={40}>
          {isMobile ? (
            <Drawer
              open={!!selectedMail}
              onOpenChange={(o) => !o && setSelectedMail("")}
            >
              <DrawerContent>{renderedMailView}</DrawerContent>
            </Drawer>
          ) : (
            renderedMailView
          )}
        </ResizablePanel>
      </ResizablePanelGroup>

      <div className="block lg:hidden">{renderedMailList}</div>
    </main>
  );
};

export default Inbox;
