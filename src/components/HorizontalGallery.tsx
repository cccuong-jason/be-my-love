"use client";
import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

type GalleryItem = {
    id: string;
    src: string;
    caption: string;
    description?: string;
    rotation?: number;
};

interface HorizontalGalleryProps {
    items: GalleryItem[];
}

export default function HorizontalGallery({ items }: HorizontalGalleryProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = 300;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div style={{ position: 'relative', width: '100%', padding: '2rem 0' }}>
            {/* Scroll Buttons */}
            <button
                onClick={() => scroll('left')}
                style={{
                    position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)',
                    zIndex: 10, background: 'rgba(255,255,255,0.8)', borderRadius: '50%', padding: '10px',
                    border: 'none', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
            >
                <ChevronLeft size={24} />
            </button>
            <button
                onClick={() => scroll('right')}
                style={{
                    position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                    zIndex: 10, background: 'rgba(255,255,255,0.8)', borderRadius: '50%', padding: '10px',
                    border: 'none', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
            >
                <ChevronRight size={24} />
            </button>

            {/* Scroll Container */}
            <div
                ref={scrollRef}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4rem', // Space for slash
                    overflowX: 'auto',
                    padding: '2rem 4rem',
                    scrollSnapType: 'x mandatory',
                    scrollbarWidth: 'none', // Firefox
                    // msOverflowStyle: 'none',  // IE 10+
                }}
                className="hide-scrollbar" // Add class to global css if needed for chrome
            >
                {items.map((item, index) => (
                    <React.Fragment key={item.id}>
                        <motion.div
                            className="gallery-card"
                            whileHover={{ y: -10 }}
                            onClick={() => setSelectedItem(item)}
                            style={{
                                flexShrink: 0,
                                width: '280px',
                                height: '380px',
                                position: 'relative',
                                borderRadius: '12px',
                                overflow: 'hidden',
                                cursor: 'pointer',
                                scrollSnapAlign: 'center',
                                boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                                background: 'white'
                            }}
                        >
                            <img
                                src={item.src}
                                alt={item.caption}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            <div style={{
                                position: 'absolute', bottom: 0, left: 0, right: 0,
                                padding: '1rem', background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                                color: 'white'
                            }}>
                                <h3 style={{ fontFamily: 'var(--font-mynerve)', fontSize: '1.2rem' }}>{item.caption}</h3>
                            </div>
                            <div style={{ position: 'absolute', top: 10, right: 10, color: 'white', opacity: 0.8 }}>
                                <Maximize2 size={20} />
                            </div>
                        </motion.div>

                        {/* Slash Separator (except after last item) */}
                        {index < items.length - 1 && (
                            <div style={{
                                height: '200px',
                                width: '2px',
                                background: '#ccc',
                                transform: 'rotate(20deg)',
                                opacity: 0.5
                            }} />
                        )}
                    </React.Fragment>
                ))}
            </div>

            {/* Preview Modal */}
            <AnimatePresence>
                {selectedItem && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed', inset: 0, zIndex: 10000,
                            background: 'rgba(0,0,0,0.95)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            padding: '2rem'
                        }}
                        onClick={() => setSelectedItem(null)}
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setSelectedItem(null)}
                            style={{
                                position: 'absolute', top: '20px', right: '20px',
                                background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%',
                                padding: '10px', cursor: 'pointer', color: 'white'
                            }}
                        >
                            <X size={32} />
                        </button>

                        <div
                            style={{ maxWidth: '900px', width: '100%', maxHeight: '90vh', display: 'flex', flexDirection: 'column', gap: '1rem' }}
                            onClick={e => e.stopPropagation()}
                        >
                            <div style={{ position: 'relative', width: '100%', height: 'auto', maxHeight: '70vh', borderRadius: '8px', overflow: 'hidden' }}>
                                <img
                                    src={selectedItem.src}
                                    alt={selectedItem.caption}
                                    style={{ width: '100%', height: '100%', objectFit: 'contain', maxHeight: '70vh' }}
                                />
                            </div>
                            <div style={{ color: 'white', textAlign: 'center' }}>
                                <h2 style={{ fontFamily: 'var(--font-great-vibes)', fontSize: '3rem', color: '#ff69b4', marginBottom: '0.5rem' }}>
                                    {selectedItem.caption}
                                </h2>
                                {selectedItem.description && (
                                    <p style={{ fontSize: '1.1rem', color: '#ddd', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
                                        {selectedItem.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
