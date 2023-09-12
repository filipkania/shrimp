import { Header } from "@/components/shared/Header";
import { useMails } from "@/lib/api/useMails";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function Home() {
  // const mails = useMails();
  // console.log(mails);

  return (
    <>
      <Header />

      <div className="container my-6 flex flex-col">
        <div className="flex gap-3 px-6 py-4 border rounded bg-blue-100 border-b">
          <span>delete</span>
          <span>new</span>
        </div>

        <div className="mt-3 overflow-hidden rounded-md border">
          {new Array(5).fill(0).map((_, i) => (
            <Link
              href="/"
              key={i}
              className={cn(
                "flex items-center cursor-pointer gap-4 px-5 py-3 hover:bg-gray-200",
                i % 2 ? "bg-gray-50" : "bg-gray-100",
                i !== 4 && "border-b"
              )}
            >
              <b>Author</b>
              <div className="flex gap-1 w-full">
                <span>Title...</span> <span className="hidden w-1/3 text-gray-500 md:block">- Description</span>
              </div>
              <span className="text-sm text-gray-600">12:02</span>
            </Link>
          ))}
        </div>
      </div>

      <span>x</span>
    </>
  );
}
