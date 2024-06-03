import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import StoreProvider from "./StoreProvider";

import SessionProvider from "./components/SessionProvider";
// import { getServerSession } from "next-auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Typing Speed Test",
  description: "Typing speed test with real time accuracy calculation.",
  keywords:
    "typing test, affandif typing test, wpm calculation, typing speed test, achmad affandi fauzan",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const session = await getServerSession();
  return (
    <html lang="en">
      <body className={inter.className}>
        <StoreProvider>
          <SessionProvider>
            {children}
            <Toaster position="top-right" expand={true} richColors />
          </SessionProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
