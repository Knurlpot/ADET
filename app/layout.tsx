import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "nudge - Manage Your Tasks Efficiently",
  description: "Stay organized and get more done with TaskFlow, your intuitive task management system.",
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