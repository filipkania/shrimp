import { ComposeProvider } from "@/components/inbox/compose-provider";
import { InboxNav } from "@/components/inbox/MailNav";
import { MailList } from "@/components/inbox/MailList";
import { MailView } from "@/components/inbox/mail-view";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useHash } from "@/lib/useHash";
import { useLocalStorage, useMediaQuery, useToggle } from "@uidotdev/usehooks";

const Inbox = () => {
  const [selectedMail, setSelectedMail] = useHash();
  const [menuOpened, toggleMenu] = useToggle();

  const [_layout, setLayout] = useLocalStorage("inbox_layout", "[35,65]");
  const isMobile = useMediaQuery("(max-width: 1024px)");

  const layout = JSON.parse(_layout) as Array<number>;

  if (isMobile)
    return (
      <main className="flex h-[100dvh] w-full overflow-y-hidden">
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
          <DrawerContent className="outline-none">
            <MailView />
          </DrawerContent>
        </Drawer>
      </main>
    );

  return (
    <main className="flex h-[100dvh] w-full">
      <ComposeProvider>
        <InboxNav />

        <ResizablePanelGroup
          className="!hidden h-full w-full lg:!flex"
          direction={"horizontal"}
          onLayout={(layout) => {
            setLayout(JSON.stringify(layout));
          }}
        >
          <ResizablePanel
            className="min-w-[24rem]"
            defaultSize={layout[0]}
            minSize={20}
          >
            <MailList />
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={layout[1]} minSize={40}>
            <MailView />
          </ResizablePanel>
        </ResizablePanelGroup>
      </ComposeProvider>
    </main>
  );
};

export default Inbox;
