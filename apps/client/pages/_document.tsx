import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="[text-size-adjust:90%] lg:[text-size-adjust:100%]">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
