import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic", "latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "فروشگاه لباس",
  description: "فروشگاه اینترنتی پوشاک",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`${vazirmatn.variable} flex min-h-screen flex-col`}>
        <Providers>
          <Header />
          <main className="mx-auto w-full max-w-5xl flex-1 p-4">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
