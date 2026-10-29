import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Coliseum English Platform",
  description: "Coliseum Logistics School ingliz tili platformasi",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="uz">
      <body>{children}</body>
    </html>
  );
}
