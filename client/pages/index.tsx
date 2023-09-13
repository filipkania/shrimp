import { MailEntry } from "@/components/pages/Mails/MailEntry";
import { Header } from "@/components/shared/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useMails } from "@/lib/api/useMails";
import { useAuth } from "@/lib/auth/AuthContext";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const { user } = useAuth();
  const { data } = useMails();

  const mails = data || new Array(15).fill(null);
  console.log(mails)

  return (
    <>
      <Header />

      <div className="container my-6 flex flex-col">
        <h1 className="my-5 flex items-center gap-2 text-3xl font-bold">
          Welcome back,{" "}
          {user?.username || (
            <Skeleton className="h-[1.9rem] w-full max-w-[8rem]" />
          )}
        </h1>

        <div className="mt-3 overflow-hidden rounded-md border">
          <div className="flex min-h-[3.5rem] w-full flex-row-reverse items-center gap-2 border-b px-5">
            <Link href="/mail/new">
              <Button variant="outline">
                <Plus />
              </Button>
            </Link>

            <Input
              placeholder="Search..."
              className="w-full md:max-w-[15rem]"
            />
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
    </>
  );
}
