import { type Editor } from "@tiptap/react";

/**
 * This function tranforms TipTaps HTML to Mail-compatible
 * HTML, during this process, we are:
 * - adding custom styling to some HTML tags,
 * - replacing all empty paragraphs with <br/>
 */
export const exportToHTML = (editor: Editor) => {
  const originalHtml = editor.getHTML();
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
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400..800&display=swap" rel=stylesheet>
    </head>
    <body class="margin:0;">
      <div style="line-height:1.5;font-size:16px;padding:4px;color:#000;background-color:#fff;font-family:Inter,'SF Pro Display',-apple-system,BlinkMacSystemFont,'Open Sans','Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,'Fira Sans','Droid Sans','Helvetica Neue',sans-serif">
        ${doc.body.innerHTML}
      </div>
    </body>
  </html>
  `.trim();
};

const elementStyling: Record<string, Partial<CSSStyleDeclaration>> = {
  H1: {
    fontWeight: "800",
    fontSize: "2.25rem",
    margin: "0",
  },
  H2: {
    fontWeight: "800",
    fontSize: "2rem",
    margin: "0",
  },
  H3: {
    fontWeight: "800",
    fontSize: "1.75rem",
    margin: "0",
  },

  S: {
    textDecoration: "line-through 1px",
  },

  UL: {
    paddingLeft: "1.25rem",
    listStyleType: "disc",
    margin: "0",
  },
  OL: {
    paddingLeft: "1.25rem",
    listStyleType: "decimal",
    margin: "0",
  },

  P: {
    margin: "0",
  },

  BLOCKQUOTE: {
    borderLeft: "2px rgba(115, 115, 115, 0.3) solid",
    paddingLeft: "0.6rem",
    margin: "0",
  },
};
