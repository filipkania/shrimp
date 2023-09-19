import type { BlockNoteEditor } from "@blocknote/core";
import { BlockNoteView, useBlockNote } from "@blocknote/react";

import "@blocknote/core/style.css";
import { exportToHTML } from "./exportToHTML";
import { useTheme } from "next-themes";

export default function Editor() {
  const editor: BlockNoteEditor = useBlockNote({
    async onEditorContentChange(editor) {
      const html = await exportToHTML(editor);
      console.log(html);
    },
  });

  const { resolvedTheme } = useTheme();

  return (
    <BlockNoteView editor={editor} theme={resolvedTheme as "light" | "dark"} />
  );
}
