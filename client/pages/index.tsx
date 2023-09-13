import { MailEntry } from "@/components/pages/Mails/MailEntry";
import { Header } from "@/components/shared/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useMails } from "@/lib/api/useMails";
import { useAuth } from "@/lib/auth/AuthContext";
import { cn } from "@/lib/utils";
import { Plus, RotateCw } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const { user } = useAuth();
  const { data, refetch } = useMails();

  const [reloading, setReloading] = useState(false);

  const mails = data || new Array(15).fill(null);

  return (
    <div className="container my-6 flex flex-col">
      <h1 className="my-5 flex items-center gap-2 text-3xl font-bold">
        Welcome back,{" "}
        {user?.username || (
          <Skeleton className="h-[1.9rem] w-full max-w-[8rem]" />
        )}
      </h1>

      <div className="mt-3 overflow-hidden rounded-md border">
        <div className="flex min-h-[3.5rem] w-full flex-row items-center justify-between gap-2 border-b px-5">
          <Button
            variant="outline"
            disabled={reloading}
            onClick={async () => {
              setReloading(true);
              await refetch();
              setReloading(false);
            }}
          >
            <RotateCw
              className={cn(
                "h-5 w-5 text-gray-800",
                reloading && "animate-spin"
              )}
            />
          </Button>

          <div className="flex gap-2">
            <Input
              placeholder="Search..."
              className="w-full md:max-w-[15rem]"
            />

            <Link href="/mail/new">
              <Button variant="outline">
                <Plus className="h-5 w-5 text-gray-800" />
              </Button>
            </Link>
          </div>
        </div>

        {mails.map((mail, i) => (
          <MailEntry
            key={i}
            className={cn(i % 2 && "bg-gray-50", i !== 4 && "border-b")}
            data={mail}
          />
        ))}
      </div>
    </div>
  );
}
