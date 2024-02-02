import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import Head from "next/head";

const queryClient = new QueryClient();

const CSRAuthProvider = dynamic(() => import("@/lib/auth/AuthProvider"), {
  ssr: false,
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0"
        />
      </Head>
      <QueryClientProvider client={queryClient}>
        <CSRAuthProvider>
          <Component {...pageProps} />
          <Toaster richColors />

          <ReactQueryDevtools initialIsOpen={false} />
        </CSRAuthProvider>
      </QueryClientProvider>
    </>
  );
}
