import type { Metadata } from "next";
import Image from "next/image";
import { Mynerve, Open_Sans, Great_Vibes, Pacifico } from "next/font/google";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
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
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
};

import EditorProvider from "@/components/Editor/EditorProvider";
import HeartPop from "@/components/Effects/HeartPop";
import AppHeader from "@/components/AppHeader";

// Check if Clerk key is available (may not be during static prerendering on Vercel)
const hasClerkKey = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = (
    <html lang="en">
      <body className={`${mynerve.variable} ${openSans.variable} ${greatVibes.variable} ${pacifico.variable} antialiased`}>
        <AppHeader hasClerkKey={hasClerkKey} />
        <EditorProvider>
          <HeartPop />
          {children}
        </EditorProvider>
      </body>
    </html>
  );

  // Wrap with ClerkProvider only if the key is available
  if (hasClerkKey) {
    return <ClerkProvider>{content}</ClerkProvider>;
  }

  return content;
}

