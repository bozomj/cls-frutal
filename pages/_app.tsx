import "../styles/globals.css";
import "../lib/fontawesome";
import Head from "next/head";

import type { AppProps } from "next/app";

import BackdropProvider from "@/ui/backdrop/BackdropProvider";
import { UserProvider } from "@/contexts/userProvider";
import { GetServerSideProps, GetServerSidePropsContext } from "next";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </Head>

      <UserProvider>
        <BackdropProvider>
          <Component {...pageProps} />
        </BackdropProvider>
      </UserProvider>
    </>
  );
}
