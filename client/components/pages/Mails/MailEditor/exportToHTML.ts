import type { BlockNoteEditor } from "@blocknote/core";

/**
 * This function exports BlockNotes blocks to Mail-compatible
 * HTML, during this process, we are:
 * - stripping all classes,
 * - adding custom styling to some HTML tags,
 * - converting data-background-color and data-text-color to style param,
 * - replacing all empty paragraphs with <br/>
 *
 * @param editor
 */
export const exportToHTML = async (editor: BlockNoteEditor) => {
  const originalHtml = await editor.blocksToHTML(editor.topLevelBlocks);
  const doc = new DOMParser().parseFromString(originalHtml, "text/html");

  const walk = (element: Element) => {
    const children = Array.from(element.children);

    for (const elem of children) {
      // replacing empty paragraphs with line breaks
      if (elem.childNodes.length === 0 && elem.tagName === "P") {
        elem.replaceWith(document.createElement("br"));
        continue;
      }

      // stripping classes
      elem.removeAttribute("class");

      // adding custom styling
      if (elementStyling.hasOwnProperty(elem.tagName)) {
        Object.entries(elementStyling[elem.tagName]).forEach((style) => {
          const [key, value] = style as [any, string];
          (elem as HTMLElement).style[key] = value;
        });
      }

      // converting data-background-color and data-text-color
      const bgColor = elem.getAttribute("data-background-color");
      if (!!bgColor && colors.hasOwnProperty(bgColor)) {
        (elem as HTMLElement).style.backgroundColor =
          colors[bgColor as keyof typeof colors].background;
        elem.removeAttribute("data-background-color");
      }

      const textColor = elem.getAttribute("data-text-color");
      if (!!textColor && colors.hasOwnProperty(textColor)) {
        (elem as HTMLElement).style.color =
          colors[textColor as keyof typeof colors].text;
        elem.removeAttribute("data-text-color");
      }

      if (elem.childNodes.length > 0) {
        walk(elem);
      }
    }
  };

  walk(doc.body);

  // remove last line break
  if (doc.body.lastChild?.nodeName === "BR") {
    doc.body.lastChild.remove();
  }

  return `
  <!DOCTYPE HTML>
  <html>
    <head>
      <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel=stylesheet>
    </head>
    <body>
      <div style="font-size:16px;padding:16px;color:#3f3f3f;background-color:#fff;width:100%;height:100%;font-family:Inter,'SF Pro Display',-apple-system,BlinkMacSystemFont,'Open Sans','Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,'Fira Sans','Droid Sans','Helvetica Neue',sans-serif">
        ${doc.body.innerHTML}
      </div>
    </body>
  </html>
  `.trim();
};

const elementStyling: Record<string, Partial<CSSStyleDeclaration>> = {
  H1: {
    fontWeight: "700",
    fontSize: "2rem",
    margin: "0",
  },
  H2: {
    fontWeight: "700",
    fontSize: "1.65rem",
    margin: "0",
  },
  H3: {
    fontWeight: "700",
    fontSize: "1.35rem",
    margin: "0",
  },

  S: {
    textDecoration: "line-through 3px",
  },
};

const colors = {
  gray: {
    text: "#9b9a97",
    background: "#ebeced",
  },
  brown: {
    text: "#64473a",
    background: "#e9e5e3",
  },
  red: {
    text: "#e03e3e",
    background: "#fbe4e4",
  },
  orange: {
    text: "#d9730d",
    background: "#f6e9d9",
  },
  yellow: {
    text: "#dfab01",
    background: "#fbf3db",
  },
  green: {
    text: "#4d6461",
    background: "#ddedea",
  },
  blue: {
    text: "#0b6e99",
    background: "#ddebf1",
  },
  purple: {
    text: "#6940a5",
    background: "#eae4f2",
  },
  pink: {
    text: "#ad1a72",
    background: "#f4dfeb",
  },
};
