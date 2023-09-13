import { MailEntry } from "@/components/pages/Mails/MailEntry";
import { Header } from "@/components/shared/Header";
import { cn } from "@/lib/utils";

export default function Home() {
  // const mails = useMails();
  // console.log(mails);

  return (
    <>
      <Header />

      <div className="container my-6 flex flex-col">
        <div className="flex gap-3 rounded border border-b bg-blue-100 px-6 py-4">
          <span>delete</span>
          <span>new</span>
        </div>

        <div className="mt-3 overflow-hidden rounded-md border">
          {new Array(5).fill(0).map((_, i) => (
            <MailEntry
              key={i}
              className={cn(i % 2 && "bg-gray-50", i !== 4 && "border-b")}
              // data={null}
              data={{
                author: "Author",
                title: "something",
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
