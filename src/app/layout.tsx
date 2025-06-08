import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "社員限定極秘サイト",
  description: "社外秘盛り沢山！",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        {children}
      </body>
    </html>
  );
}
