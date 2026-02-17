"use client";
import React from "react";
import { useContentStore } from "@/store/contentStore";
import ParallaxSection from "./ParallaxSection";
import Link from "next/link";
import HorizontalGallery from "./HorizontalGallery";

export default function Gallery() {
    const gallery = useContentStore((state) => state.gallery);

    if (!gallery || !gallery.images || gallery.images.length === 0) return null;

    return (
        <ParallaxSection
            style={{
                minHeight: '100vh',
                background: 'linear-gradient(to bottom, #fff0f5, #fff)', // Light gradient
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
                padding: '4rem 0'
            }}
            parallaxDistance={30}
        >
            <h2 style={{
                textAlign: 'center',
                fontFamily: 'var(--font-great-vibes)',
                fontSize: '4rem',
                color: '#ff69b4', // Changed to pink for visibility on light bg
                marginBottom: '1rem',
                zIndex: 10,
                textShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
                {gallery.title}
            </h2>

            <p style={{
                textAlign: 'center',
                color: '#666',
                marginBottom: '3rem',
                fontSize: '1.2rem',
                fontFamily: 'var(--font-mynerve)'
            }}>
                Drag or scroll to explore our memories
            </p>

            <HorizontalGallery items={gallery.images} />

        </ParallaxSection>
    );
}
