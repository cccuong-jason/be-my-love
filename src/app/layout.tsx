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
import MusicPlayer from "@/components/MusicPlayer";
import FloatingAssets from "@/components/FloatingAssets";

// ... imports

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${mynerve.variable} ${openSans.variable} ${greatVibes.variable} ${pacifico.variable} antialiased`}>
          <header style={{ position: 'absolute', top: '10px', left: '10px', right: '10px', zIndex: 1000, display: 'flex', justifyContent: 'space-between', alignItems: 'center', pointerEvents: 'none' }}>
            <div style={{ pointerEvents: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Image src="/logo.png" alt="Be My Love Logo" width={50} height={50} style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} />
              <span style={{ fontFamily: 'var(--font-pacifico), cursive', fontSize: '1.8rem', color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>Be My Love</span>
            </div>
            <div style={{ pointerEvents: 'auto', display: 'flex', gap: '15px', alignItems: 'center' }}>
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="auth-btn" style={{ padding: '8px 16px', background: 'white', border: 'none', borderRadius: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', cursor: 'pointer', fontWeight: 'bold', color: '#ff4d4d' }}>
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <a href="/dashboard" style={{ textDecoration: 'none', color: '#ff4d4d', fontWeight: 'bold', background: 'rgba(255,255,255,0.8)', padding: '5px 12px', borderRadius: '15px' }}>
                  Dashboard
                </a>
                <UserButton />
              </SignedIn>
            </div>
          </header>
          <EditorProvider>
            <HeartPop />
            <FloatingAssets />
            <MusicPlayer />
            {children}
          </EditorProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
