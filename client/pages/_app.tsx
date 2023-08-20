import "@/styles/globals.css";
import { DefaultSeo } from "next-seo";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
	return (
		<>
			<DefaultSeo
				defaultTitle="Shrimp"
				titleTemplate="%s | Shrimp"
				dangerouslySetAllPagesToNoIndex={true}
				dangerouslySetAllPagesToNoFollow={true}
			/>

			<Component {...pageProps} />
		</>
	);
}
