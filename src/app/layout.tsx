import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Card Manager",
  description: "A simple app to manage your credit cards",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50`}>
        <div className="flex flex-col h-screen">
          <Header />
          <main className="flex-1 overflow-y-auto">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
