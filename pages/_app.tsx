import "../styles/globals.css";
import "../lib/fontawesome";
import Head from "next/head";

import type { AppProps } from "next/app";
import { PaginationProvider } from "@/contexts/PaginactionContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </Head>

      <PaginationProvider>
        <Component {...pageProps} />
      </PaginationProvider>
    </>
  );
}
