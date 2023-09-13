import { MailEntry } from "@/components/pages/Mails/MailEntry";
import { Header } from "@/components/shared/Header";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth/AuthContext";
import { cn } from "@/lib/utils";

export default function Home() {
  const { user } = useAuth();

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
          <div className="flex min-h-[3.5rem] w-full items-center border-b px-6">
            x
          </div>

          {new Array(5).fill(0).map((_, i) => (
            <MailEntry
              key={i}
              className={cn(i % 2 && "bg-gray-50", i !== 4 && "border-b")}
              // data={null}
              data={{
                author: "Author",
                title: "somethiasdfasdfasdfasdf awdadsfasdf asdf ng",
                description: "hello",
                created_at: "2023-09-13T10:51:35.408Z",
              }}
            />
          ))}
        </div>
      </div>

      <span>x</span>
    </>
  );
}
