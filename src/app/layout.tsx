import type { Metadata } from "next";
import { Mynerve, Open_Sans, Great_Vibes, Pacifico } from "next/font/google";
import "./globals.css";

const mynerve = Mynerve({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-mynerve",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
});

const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-great-vibes",
});

const pacifico = Pacifico({
  variable: "--font-pacifico",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Be My Love",
  description: "A specialized love journey",
};

import EditorProvider from "@/components/Editor/EditorProvider";
import HeartPop from "@/components/Effects/HeartPop";
import MusicPlayer from "@/components/MusicPlayer";
import ScrollIndicator from "@/components/Effects/ScrollIndicator";

// ... imports

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${mynerve.variable} ${openSans.variable} ${greatVibes.variable} ${pacifico.variable} antialiased`}>
        <EditorProvider>
          <HeartPop />
          <MusicPlayer />
          <ScrollIndicator />
          {children}
        </EditorProvider>
      </body>
    </html>
  );
}


