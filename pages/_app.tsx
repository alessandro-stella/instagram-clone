import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import localFont from "next/font/local";
import Head from "next/head";
import NextNProgress from "nextjs-progressbar";

const Segoe = localFont({
    src: [
        {
            path: "../styles/fonts/Segoe UI.ttf",
            weight: "400",
            style: "normal",
        },
        {
            path: "../styles/fonts/Segoe UI Italic.ttf",
            weight: "400",
            style: "italic",
        },
        {
            path: "../styles/fonts/Segoe UI Bold.ttf",
            weight: "700",
            style: "normal",
        },
        {
            path: "../styles/fonts/Segoe UI Bold Italic.ttf",
            weight: "700",
            style: "italic",
        },
    ],
});

export default function App({ Component, pageProps }: AppProps) {
    return (
        <SessionProvider session={pageProps.session}>
            <Head>
                <link rel="icon" href="/favicon.ico?v=1" type="image/x-icon" />
                <link
                    rel="shortcut icon"
                    href="/favicon.ico?v=1"
                    type="image/x-icon"
                />
                <title>Instagram</title>
            </Head>
            <main className={Segoe.className}>
                <NextNProgress />
                <Component {...pageProps} />
            </main>
        </SessionProvider>
    );
}
