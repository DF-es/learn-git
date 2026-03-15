import type { Metadata } from "next";
import "./globals.css";

// Using official Next.js font loading
import { Cinzel as CinzelFont, Noto_Sans_JP as NotoSansJPFont } from "next/font/google";

const cinzel = CinzelFont({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["400", "700"],
});

const notoTabs = NotoSansJPFont({
  subsets: ["latin"],
  variable: "--font-noto",
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Solo Guild - 自分専用ギルド",
  description: "ここはあなたの欲望を叶え、野望を達成するための秘密のギルドです。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body className={`${notoTabs.variable} ${cinzel.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
