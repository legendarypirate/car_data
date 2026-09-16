import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getSiteChrome } from "@/lib/cms";
import "./globals.css";

const inter = Inter({
  variable: "--font-exo",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: {
    default: "NDA AUTO — Дэлхийн шилдэг автомашинууд",
    template: "%s · NDA AUTO",
  },
  description:
    "NDA AUTO нь дэлхийн шилдэг автомашинуудыг Монголын хэрэглэгчдэд хүргэх зорилготой. Бид чанар, технологи, тогтвортой хөгжлийг эрхэмлэн, таны итгэлтэй түнш байна.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const chrome = await getSiteChrome();

  return (
    <html lang="mn" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-white font-sans text-ink">
        <Header data={chrome?.header} />
        {children}
        <Footer data={chrome?.footer} />
      </body>
    </html>
  );
}
