import dynamic from "next/dynamic";
import { FormEvent, forwardRef, useRef } from "react";
import type { Ref as EditorRefType } from "../../components/pages/Mails/MailEditor";
import { Input } from "@/components/ui/input";
import { API } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/auth/AuthContext";

const Editor = dynamic(
  () => import("../../components/pages/Mails/MailEditor"),
  { ssr: false }
);

const ForwardRefEditor = forwardRef<EditorRefType>((props, ref) => (
  <Editor {...props} editorRef={ref} />
));
ForwardRefEditor.displayName = "ForwardRefEditor";

const CreateMailPage = () => {
  const editorRef = useRef<EditorRefType>(null);
  const { toast } = useToast();
  const { token } = useAuth();

  const sendEmailHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = new FormData(e.currentTarget);
    const { email, subject } = Object.fromEntries(form.entries());

    const [html, markdown] = await Promise.all([
      editorRef.current?.getHTML(),
      editorRef.current?.getMarkdown(),
    ]);

    console.log(html, markdown);

    try {
      if (process.env.NODE_ENV === "development" && !confirm("Are you sure you want to send an email?")) return;

      await API.post(
        "/mails/send",
        {
          to: [{ email }],
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

      toast({
        title: "Email sent.",
      });
    } catch (_) {
      toast({
        title: "Something went wrong.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={sendEmailHandler} className="container my-11 flex flex-col">
      <h1 className="text-3xl font-bold">Send an email</h1>

      <div className="my-5 flex flex-col items-center justify-center">
        <Input name="email" required placeholder="email" />
        <Input name="subject" required placeholder="subject" />

        <div className="my-5 overflow-scroll w-full rounded-xl border p-4">
          <ForwardRefEditor ref={editorRef} />
        </div>

        <button>send</button>
      </div>
    </form>
  );
};

export default CreateMailPage;
