"use client";
import React, { Suspense } from 'react';
import Image from "next/image";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useSearchParams } from 'next/navigation';

function HeaderContent({ hasClerkKey }: { hasClerkKey: boolean }) {
    const searchParams = useSearchParams();
    const isPublic = searchParams.get('public') === 'true';

    return (
        <header style={{ position: 'absolute', top: '10px', left: '10px', right: '10px', zIndex: 1000, display: 'flex', justifyContent: 'space-between', alignItems: 'center', pointerEvents: 'none' }}>
            <div style={{ pointerEvents: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Image src="/logo.png" alt="Be My Love Logo" width={50} height={50} style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} />
                <span style={{ fontFamily: 'var(--font-pacifico), cursive', fontSize: '1.8rem', color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>Be My Love</span>
            </div>

            {!isPublic && hasClerkKey && (
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
            )}
        </header>
    );
}

export default function AppHeader({ hasClerkKey }: { hasClerkKey: boolean }) {
    return (
        <Suspense fallback={<div style={{ height: 60 }}></div>}>
            <HeaderContent hasClerkKey={hasClerkKey} />
        </Suspense>
    );
}
