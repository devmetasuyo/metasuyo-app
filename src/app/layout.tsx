import "./globals.scss";
import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ClientLayout from "@/components/clientlayout";

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
  return (
    <html lang="es">
      <body className={inter.className}>
        <ClientLayout>
          {props.children}
        </ClientLayout>
      </body>
    </html>
  );
}
