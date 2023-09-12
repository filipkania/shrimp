import "@/styles/globals.css";

import AuthProvider from "@/lib/auth/AuthProvider";
import { Toaster } from "@/components/ui/toaster"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { DefaultSeo } from "next-seo";
import type { AppProps } from "next/app";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10000,
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
          <Component {...pageProps} />
          <Toaster />
        </AuthProvider>

        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </>
  );
}
