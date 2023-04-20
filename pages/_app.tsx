import "@/styles/globals.css";
import type { AppProps } from "next/app";
import localFont from "next/font/local";

const Segoe = localFont({
    src: [
        {
            path: "../fonts/Segoe UI.ttf",
            weight: "400",
            style: "normal",
        },
        {
            path: "../fonts/Segoe UI Italic.ttf",
            weight: "400",
            style: "italic",
        },
        {
            path: "../fonts/Segoe UI Bold.ttf",
            weight: "700",
            style: "normal",
        },
        {
            path: "../fonts/Segoe UI Bold Italic.ttf",
            weight: "700",
            style: "italic",
        },
    ],
});

export default function App({ Component, pageProps }: AppProps) {
    return (
        <main className={Segoe.className}>
            <Component {...pageProps} />
        </main>
    );
}
