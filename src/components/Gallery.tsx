"use client";
import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValue } from "framer-motion";
import { useContentStore } from "@/store/contentStore";
import { X } from "lucide-react";
import ParallaxSection from "./ParallaxSection";

const CARD_WIDTH = 260;
const CARD_GAP = 40;
const CARD_FULL_WIDTH = CARD_WIDTH + CARD_GAP;

export default function Gallery() {
    const gallery = useContentStore((state) => state.gallery);
    const [selectedImg, setSelectedImg] = useState<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollXProgress } = useScroll({ container: containerRef });

    if (!gallery || !gallery.images || gallery.images.length === 0) return null;

    return (
        <ParallaxSection
            style={{
                height: '100vh',
                background: '#111',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden'
            }}
            parallaxDistance={30}
        >
            <h2 style={{
                textAlign: 'center',
                fontFamily: 'var(--font-great-vibes)',
                fontSize: '4rem',
                color: '#fff',
                marginBottom: '2rem',
                zIndex: 10
            }}>
                {gallery.title}
            </h2>

            <div
                ref={containerRef}
                style={{
                    display: "flex",
                    gap: `${CARD_GAP}px`,
                    padding: `0 calc(50vw - ${CARD_WIDTH / 2}px)`,
                    overflowX: "auto",
                    scrollSnapType: "x mandatory",
                    scrollbarWidth: "none", // Firefox
                    height: '500px',
                    alignItems: 'center',
                }}
            >
                {gallery.images.map((img, i) => (
                    <CarouselItem
                        key={img.id}
                        img={img}
                        index={i}
                        total={gallery.images.length}
                        containerRef={containerRef}
                        onClick={() => setSelectedImg(img)}
                    />
                ))}
            </div>

            <style jsx>{`
                div::-webkit-scrollbar { display: none; }
            `}</style>

            {/* Lightbox */}
            {selectedImg && (
                <div
                    style={{
                        position: 'fixed', inset: 0, zIndex: 9999,
                        background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(10px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                    onClick={() => setSelectedImg(null)}
                >
                    <button style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                        <X size={40} />
                    </button>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={(e) => e.stopPropagation()}
                        style={{ maxWidth: '90vw', maxHeight: '90vh', textAlign: 'center' }}
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={selectedImg.src} alt={selectedImg.caption} style={{ maxWidth: '100%', maxHeight: '70vh', borderRadius: '8px', boxShadow: '0 0 50px rgba(255,255,255,0.1)' }} />
                        <h3 style={{ color: 'white', fontFamily: 'var(--font-mynerve)', fontSize: '2rem', marginTop: '1rem' }}>{selectedImg.caption}</h3>
                        {selectedImg.description && <p style={{ color: '#ccc', marginTop: '0.5rem' }}>{selectedImg.description}</p>}
                    </motion.div>
                </div>
            )}
        </ParallaxSection>
    );
}

function CarouselItem({ img, index, total, containerRef, onClick }: any) {
    // Basic implementation of offset-based animation
    // Ideally we'd use useItemOffset from motion-plus but we can approximate it with useTransform

    return (
        <motion.div
            onClick={onClick}
            style={{
                width: `${CARD_WIDTH}px`,
                height: '350px',
                flexShrink: 0,
                borderRadius: '20px',
                overflow: 'hidden',
                position: 'relative',
                cursor: 'pointer',
                scrollSnapAlign: 'center',
                perspective: '1000px',
            }}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
        >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={img.src}
                alt={img.caption}
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                }}
            />
            <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                padding: '20px',
                background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                color: 'white'
            }}>
                <h3 style={{ fontFamily: 'var(--font-mynerve)', fontSize: '1.5rem', marginBottom: '4px' }}>{img.caption}</h3>
            </div>
        </motion.div>
    );
}
