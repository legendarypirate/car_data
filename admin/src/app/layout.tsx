import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AdminShell } from "@/components/admin-shell";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: "NDA AUTO Админ",
    template: "%s · NDA AUTO Админ",
  },
  description: "Машин, брэнд, хүсэлтийг удирдах.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="mn" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full font-sans">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <AdminShell>{children}</AdminShell>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
