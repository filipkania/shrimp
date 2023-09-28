import type { BlockNoteEditor } from "@blocknote/core";
import { BlockNoteView, useBlockNote } from "@blocknote/react";

import "@blocknote/core/style.css";
import { exportToHTML } from "./exportToHTML";
import { useTheme } from "next-themes";
import { useImperativeHandle } from "react";

export type Ref = {
  getHTML: () => ReturnType<typeof exportToHTML>;
  getMarkdown: () => Promise<string>;
};

type Props = {
  editorRef: React.Ref<Ref>;
};

const Editor = ({ editorRef }: Props) => {
  const editor: BlockNoteEditor = useBlockNote();
  const { resolvedTheme } = useTheme();

  useImperativeHandle(editorRef, () => ({
    getHTML: async () => exportToHTML(editor),
    getMarkdown: async () => editor.blocksToMarkdown(editor.topLevelBlocks),
  }));

  return (
    <BlockNoteView className="[&>*]:!bg-transparent" editor={editor} theme={resolvedTheme as "light" | "dark"} />
  );
};

export default Editor;
