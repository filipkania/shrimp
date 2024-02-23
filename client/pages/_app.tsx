import { Toaster } from "@/components/ui/sonner";
import "@/styles/globals.scss";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { DefaultSeo } from "next-seo";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import Head from "next/head";
import { Inter } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({ subsets: ["latin"] });

const queryClient = new QueryClient();

const CSRAuthProvider = dynamic(() => import("@/lib/auth/AuthProvider"), {
  ssr: false,
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={inter.className}>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0"
        />
        <meta name="referrer" content="no-referrer" />
      </Head>
      <QueryClientProvider client={queryClient}>
        <CSRAuthProvider>
          <TooltipProvider>
            <DefaultSeo
              titleTemplate="%s | Shrimp"
              defaultTitle="Shrimp"
              dangerouslySetAllPagesToNoIndex={true}
              dangerouslySetAllPagesToNoFollow={true}
            />

            <Component {...pageProps} />
            <Toaster richColors />

            <ReactQueryDevtools initialIsOpen={false} />
          </TooltipProvider>
        </CSRAuthProvider>
      </QueryClientProvider>
    </div>
  );
}
