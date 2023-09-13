import "@/styles/globals.css";

import AuthProvider from "@/lib/auth/AuthProvider";
import { Toaster } from "@/components/ui/toaster"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { DefaultSeo } from "next-seo";
import type { AppProps } from "next/app";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/shared/Header";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000,
    }
  }
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <DefaultSeo
        defaultTitle="Shrimp"
        titleTemplate="%s | Shrimp"
        dangerouslySetAllPagesToNoIndex={true}
        dangerouslySetAllPagesToNoFollow={true}
      />

      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Header />

            <Component {...pageProps} />

            <Toaster />
          </TooltipProvider>
        </AuthProvider>

        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </>
  );
}
