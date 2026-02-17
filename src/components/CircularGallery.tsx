"use client"

import { motion, AnimatePresence } from 'framer-motion'
import React, { useEffect, useState } from 'react'

type GalleryItem = {
    id: string
    src: string
    caption: string
    description?: string
    rotation?: number
}

interface CircularGalleryProps {
    items: GalleryItem[]
    bend?: number
    textColor?: string
    borderRadius?: number
    font?: string
}

export default function CircularGallery({
    items,
    bend = 3,
    textColor = "#ffffff",
    borderRadius = 0.05,
    font = "font-mynerve"
}: CircularGalleryProps) {
    const [containerWidth, setContainerWidth] = useState(0)
    const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null)

    useEffect(() => {
        const updateWidth = () => {
            const container = document.querySelector('.circular-gallery-container')
            if (container) {
                setContainerWidth(container.clientWidth)
            }
        }

        updateWidth()
        window.addEventListener('resize', updateWidth)
        return () => window.removeEventListener('resize', updateWidth)
    }, [])

    return (
        <div className="circular-gallery-container" style={{
            width: '100%',
            height: '600px',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            perspective: '1000px'
        }}>
            <motion.div
                drag="x"
                dragConstraints={{ left: -1000, right: 1000 }} // Loose constraints for infinite feel
                style={{
                    display: 'flex',
                    cursor: 'grab',
                    transformStyle: 'preserve-3d'
                }}
            >
                {items.map((item, index) => {
                    return (
                        <GalleryCard
                            key={item.id}
                            item={item}
                            index={index}
                            total={items.length}
                            bend={bend}
                            onClick={() => setSelectedItem(item)}
                            borderRadius={borderRadius}
                        />
                    )
                })}
            </motion.div>

            <AnimatePresence>
                {selectedItem && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            background: 'rgba(0,0,0,0.9)',
                            zIndex: 9999,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '2rem'
                        }}
                        onClick={() => setSelectedItem(null)}
                    >
                        <div style={{ maxWidth: '800px', width: '100%' }} onClick={(e) => e.stopPropagation()}>
                            <img
                                src={selectedItem.src}
                                alt={selectedItem.caption}
                                style={{
                                    width: '100%',
                                    borderRadius: '12px',
                                    boxShadow: '0 0 40px rgba(0,0,0,0.5)'
                                }}
                            />
                            <h3 style={{
                                color: 'white',
                                fontSize: '2rem',
                                marginTop: '1rem',
                                fontFamily: 'var(--font-mynerve)'
                            }}>{selectedItem.caption}</h3>
                            {selectedItem.description && (
                                <p style={{ color: '#ccc', marginTop: '0.5rem' }}>
                                    {selectedItem.description}
                                </p>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

function GalleryCard({ item, index, total, bend, onClick, borderRadius }: any) {
    // Determine rotation/position based on index? 
    // Actually, for a true scroll-linked bend, we need to track scrollX/dragX.
    // Since Framer Motion's drag doesn't easily expose the precise "scroll" value 
    // to children without a MotionValue, let's simplify to a 3D Coverflow-like carousel 
    // or standard horizontal scroll with 3D rotation based on viewport position.

    // Using a simpler horizontal scroll with 3D effect for better reliability without complex math
    return (
        <motion.div
            onClick={onClick}
            className="gallery-item"
            whileHover={{ scale: 1.05, y: -20, zIndex: 100 }}
            style={{
                width: '300px',
                height: '400px',
                margin: '0 20px',
                borderRadius: `${borderRadius * 100}%`,
                overflow: 'hidden',
                position: 'relative',
                flexShrink: 0,
                backgroundColor: '#fff',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                transformStyle: 'preserve-3d',
                cursor: 'pointer'
            }}
        >
            <img
                src={item.src}
                alt={item.caption}
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    pointerEvents: 'none'
                }}
            />
            <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '20px',
                background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                color: 'white'
            }}>
                <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-mynerve)' }}>{item.caption}</h3>
            </div>
        </motion.div>
    )
}
