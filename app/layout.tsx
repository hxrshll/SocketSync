import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SocketSync - Real-time Chat",
  description: "A modern real-time chat application built with Next.js and Socket.IO",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="mx-auto max-w-7xl px-4">
        {children}
        </div>
      </body>
    </html>
  );
}
