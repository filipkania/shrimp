import AccountSettings from "@/components/pages/Settings/AccountSettings";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

const PAGES = [AccountSettings];

const Settings = () => {
  const [active, setActive] = useState(0);
  const Component = PAGES[active];

  return (
    <div className="container">
      <h1 className="py-12 text-4xl font-bold">Settings</h1>

      <div className="flex flex-col items-start gap-6 md:flex-row">
        <div className="flex w-full flex-col gap-1 rounded border p-3 md:w-1/3 lg:w-1/4">
          {PAGES.map((Component, i) => (
            <Button
              key={i}
              variant="ghost"
              className={cn("justify-start text-left h-auto w-auto", i == active && "bg-accent/50")}
              onClick={() => setActive(i)}
            >
              {Component.displayName}
            </Button>
          ))}
        </div>

        <div className="min-h-[32rem] w-full rounded border px-8 py-5">
          <Component />
        </div>
      </div>
    </div>
  );
};

export default Settings;
