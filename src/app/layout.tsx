import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NetworkCRM",
  description:
    "A calm networking and partnership CRM for keeping relationship context close at hand.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
