import dynamic from "next/dynamic";
import { FormEvent, forwardRef, useRef, useState } from "react";
import type { Ref as EditorRefType } from "../../components/pages/Mails/MailEditor";
import { Input } from "@/components/ui/input";
import { API } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";

const Editor = dynamic(
  () => import("../../components/pages/Mails/MailEditor"),
  { ssr: false }
);

const ForwardRefEditor = forwardRef<EditorRefType>((props, ref) => (
  <Editor {...props} editorRef={ref} />
));
ForwardRefEditor.displayName = "ForwardRefEditor";

const CreateMailPage = () => {
  const [sending, setSending] = useState(false); 

  const editorRef = useRef<EditorRefType>(null);
  const router = useRouter();
  const { toast } = useToast();
  const { token } = useAuth();

  const sendEmailHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = new FormData(e.currentTarget);
    const { recipients, ccs, subject } = Object.fromEntries(form.entries());

    const [html, markdown] = await Promise.all([
      editorRef.current?.getHTML(),
      editorRef.current?.getMarkdown(),
    ]);

    try {
      if (
        process.env.NODE_ENV === "development" &&
        !confirm("Are you sure you want to send an email?")
      )
        return;
      
      setSending(true);

      await API.post(
        "/mails/send",
        {
          to: recipients
            .toString()
            .split(",")
            .map((e) => ({
              email: e.trim(),
            })),
          ccs: ccs
            .toString()
            .split(",")
            .map((e) => ({
              email: e.trim(),
            })),
          from: {
            name: "Shrimp",
            email: "shrimp@fkrq.me",
          },
          subject,
          content: [
            { type: "text/plain", value: markdown },
            { type: "text/html", value: html },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      router.push("/");

      toast({
        title: "Email sent.",
      });
    } catch (_) {
      toast({
        title: "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={sendEmailHandler} className="container my-11 flex flex-col">
      <h1 className="text-3xl font-bold">Send an email</h1>

      <div className="my-5 flex flex-col items-center justify-center rounded-xl border">
        <div className="flex w-full items-center justify-center border-b px-4 py-2">
          <span>To:</span>
          <Input
            name="recipients"
            placeholder="Recipients..."
            className="w-full border-none"
          />
        </div>

        <div className="flex w-full items-center justify-center border-b px-4 py-2">
          <span>CC:</span>
          <Input
            name="ccs"
            placeholder="Recipients..."
            className="w-full border-none"
          />
        </div>

        <div className="flex w-full items-center justify-center border-b px-4 py-2">
          <span>Subject:</span>
          <Input
            name="subject"
            placeholder="Pizza is great!"
            className="w-full border-none"
          />
        </div>

        <div className="min-h-[12rem] w-full overflow-scroll border-b py-4">
          <ForwardRefEditor ref={editorRef} />
        </div>

        <div className="flex w-full justify-end p-3">
          <Button disabled={sending}>Send message</Button>
        </div>
      </div>
    </form>
  );
};

export default CreateMailPage;
