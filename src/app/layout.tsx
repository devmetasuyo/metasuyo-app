import "./globals.scss";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import { type ReactNode } from "react";
import { cookieToInitialState } from "wagmi";
import { getConfig } from "../wagmi";
import { FeedbackModal } from "@/components/Modals/FeedbackModal";
import dynamic from "next/dynamic";

const DynamicProviders = dynamic(() => import("@/components/providers"), {
  ssr: false,
});

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: (process.env.NEXT_PUBLIC_APP_NAME as string) || "Next.js App",
  description:
    (process.env.NEXT_PUBLIC_APP_DESCRIPTION as string) || "Next.js App",
  keywords:
    (process.env.NEXT_PUBLIC_APP_KEYWORDS as string) ||
    "next.js, react, typescript",
  openGraph: {
    title: (process.env.NEXT_PUBLIC_APP_NAME as string) || "Next.js App",
    description:
      (process.env.NEXT_PUBLIC_APP_DESCRIPTION as string) || "Next.js App",
    type: "website",
    locale: "en_US",
    url: (process.env.URL as string) || "http://localhost:3000",
  },
};

export default function RootLayout(props: { children: ReactNode }) {
  const initialState = cookieToInitialState(
    getConfig(),
    headers().get("cookie")
  );
  return (
    <html lang="en">
      <body className={inter.className}>
        <DynamicProviders initialState={initialState}>
          {props.children}
          <FeedbackModal />
        </DynamicProviders>
      </body>
    </html>
  );
}
