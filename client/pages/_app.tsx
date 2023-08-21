import AuthProvider from "@/lib/auth/AuthProvider";
import "@/styles/globals.css";
import { DefaultSeo } from "next-seo";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <DefaultSeo
        defaultTitle="Shrimp"
        titleTemplate="%s | Shrimp"
        dangerouslySetAllPagesToNoIndex={true}
        dangerouslySetAllPagesToNoFollow={true}
      />

      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </>
  );
}
