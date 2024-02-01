import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";

const queryClient = new QueryClient();

const CSRAuthProvider = dynamic(() => import("@/lib/auth/AuthProvider"), {
  ssr: false
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <CSRAuthProvider>
        <Component {...pageProps} />
        <Toaster richColors />

        <ReactQueryDevtools initialIsOpen={false} />
      </CSRAuthProvider>
    </QueryClientProvider>
  );
}
