import { Maximize2Icon, MinusIcon, TrashIcon, XIcon } from "lucide-react";
import { PropsWithChildren, createContext, useContext, useEffect } from "react";
import { Input } from "../ui/input";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { Button } from "../ui/button";
import { useToggle } from "@uidotdev/usehooks";
import { cn } from "@/lib/utils";
import { type SubmitHandler, useForm } from "react-hook-form";
import { exportToHTML } from "@/lib/exportToHTML";
import { useMutation } from "@tanstack/react-query";
import { API } from "@/lib/api.mjs";
import { useAuth } from "@/lib/auth/AuthContext";

const ComposeContext = createContext({
  open: (_: boolean) => {},
  isOpen: false,
});

export const useCompose = () => useContext(ComposeContext);

type Inputs = {
  // from: string;
  to: string;
  subject: string;
};

export const ComposeProvider = ({ children }: PropsWithChildren) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        protocols: [
          "mailto",
          {
            scheme: "tel",
            optionalSlashes: true,
          },
        ],
      }),
      Placeholder.configure({
        placeholder: "Your email goes here...",
      }),
    ],
    content: "",

    editorProps: {
      attributes: {
        class: "p-4 min-h-full outline-none mailview",
      },
    },
  });

  const { token } = useAuth();
  const { register, handleSubmit } = useForm<Inputs>();
  const sendMail = useMutation({
    mutationFn: (data: any) => {
      return API.post("/mails/send", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },

    onSuccess: () => {
      toggleOpened(false);
    },
  });

  const [collapsed, toggleCollapsed] = useToggle(false);
  const [opened, toggleOpened] = useToggle(false);

  useEffect(() => {
    if (!opened && collapsed) {
      toggleCollapsed(false);
    }
  }, [opened]);

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    sendMail.mutate({
      to: [{ email: data.to }],
      from: { name: "Shrimp", email: "shrimp@fkrq.xyz" },
      subject: data.subject,
      content: [
        { type: "text/plain", value: editor?.getText() },
        {
          type: "text/html",
          value: editor ? exportToHTML(editor) : "No content.",
        },
      ],
    });
  };

  return (
    <ComposeContext.Provider value={{ open: toggleOpened, isOpen: opened }}>
      {children}

      {opened && (
        <form
          className={cn(
            "absolute bottom-2 right-8 z-10 flex flex-col rounded-xl border bg-background shadow",
            !collapsed && "h-2/3 w-3/5"
          )}
          onSubmit={handleSubmit(onSubmit)}
        >
          <div
            className={cn(
              "flex items-center justify-between gap-4 px-4 py-2",
              !collapsed && "border-b"
            )}
          >
            <h2 className="text-md font-semibold">Compose new message</h2>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => toggleCollapsed()}
              >
                {collapsed ? (
                  <Maximize2Icon className="h-4 w-4" />
                ) : (
                  <MinusIcon className="h-4 w-4" />
                )}
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => toggleOpened(false)}
              >
                <XIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {!collapsed && (
            <>
              {/* <div className="flex w-full items-center gap-2 border-b px-4 py-2">
                <span className="text-muted-foreground">From:</span>
                <Input
                  className="border-none shadow-none"
                  {...register("from", { required: true })}
                />
              </div> */}

              <div className="flex w-full items-center gap-2 border-b px-4 py-2">
                <span className="text-muted-foreground">To:</span>
                <Input
                  className="border-none shadow-none"
                  {...register("to", { required: true })}
                />

                <span className="text-muted-foreground">CC</span>
                <span className="text-muted-foreground">BCC</span>
              </div>

              <div className="flex w-full items-center gap-2 border-b px-4 py-2">
                <span className="text-muted-foreground">Subject:</span>
                <Input
                  className="border-none shadow-none"
                  {...register("subject", { required: true })}
                />
              </div>

              <div className="flex h-full w-full items-center gap-2 overflow-auto border-b">
                <EditorContent className="h-full w-full" editor={editor} />
              </div>

              <div className="flex w-full items-center justify-between gap-2 px-4 py-2">
                <Button type="button" variant="ghost" size="icon">
                  <TrashIcon className="h-4 w-4 text-red-500" />
                </Button>

                <Button type="submit" className="rounded-lg" variant="outline">
                  Send
                </Button>
              </div>
            </>
          )}
        </form>
      )}
    </ComposeContext.Provider>
  );
};
