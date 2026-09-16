import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Morrow & Wick | Hand Poured Home Fragrance",
  description: "Artisanal soy candles and mindful home fragrance, poured in small batches.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
