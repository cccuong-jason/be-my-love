"use client";
import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useContentStore } from '@/store/contentStore';
import styles from './Journey.module.css';
import { createPortal } from 'react-dom';

export default function Journey() {
    const timeline = useContentStore((state) => state.timeline);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedEvent, setSelectedEvent] = useState<typeof timeline.events[0] | null>(null);
    const [exitDirection, setExitDirection] = useState(-1);

    const [isMounted, setIsMounted] = useState(false);
    React.useEffect(() => setIsMounted(true), []);

    // Sound Effect
    const playSwipeSound = () => {
        try {
            const audio = new Audio('/sounds/swipe.mp3');
            audio.volume = 0.5;
            audio.play().catch(() => { }); // Ignore errors if file missing
        } catch (e) {
            // ignore
        }
    };

    const handleNext = (direction: number) => {
        setExitDirection(direction);
        playSwipeSound();
        setCurrentIndex((prev) => prev + 1);
    };

    const VISIBLE_CARDS = 4;

    // Generate cards to display
    const cardsToShow = useMemo(() => {
        return Array.from({ length: VISIBLE_CARDS }).map((_, i) => {
            const index = currentIndex + i;
            const eventIndex = index % timeline.events.length;
            const event = timeline.events[eventIndex];

            // Pseudo-random generation based on index for stable "messiness"
            // We use the absolute index so 'next' time this card appears it might slightly differ or stay same
            // actually using pseudo-random based on global index 'index' ensures smooth transitions
            const pseudoRandom = (seed: number) => {
                const x = Math.sin(seed) * 10000;
                return x - Math.floor(x);
            };

            const baseRotation = (pseudoRandom(index) * 40) - 20; // -20 to 20 deg
            const baseXOffset = (pseudoRandom(index + 100) * 50) - 25; // -25 to 25 px
            const baseYOffset = (pseudoRandom(index + 200) * 50) - 25; // -25 to 25 px

            // The on top photo always has no rotation, it must be straight vertical
            const rotation = i === 0 ? 0 : baseRotation;
            const xOffset = i === 0 ? 0 : baseXOffset;
            const yOffset = i === 0 ? 0 : baseYOffset;

            const stableIndex = index % 1000; // Large arbitrary limit before looping perfectly
            const uniqueKey = `card-slot-${stableIndex}`;

            return {
                event: event,
                uniqueKey: uniqueKey,
                offsetIndex: i, // 0 = front
                rotation,
                xOffset,
                yOffset
            };
        }).reverse(); // Reverse so the first item (front) is last in the DOM (on top)
    }, [currentIndex, timeline.events]);

    return (
        <section className={styles.journeySection}>
            <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={styles.title}
            >
                {timeline.title}
            </motion.h2>

            <div className={styles.stackContainer}>
                <AnimatePresence custom={exitDirection}>
                    {cardsToShow.map((item) => (
                        <Card
                            key={item.uniqueKey}
                            event={item.event}
                            isFront={item.offsetIndex === 0}
                            onSwipe={handleNext}
                            onSelect={() => setSelectedEvent(item.event)}
                            rotation={item.rotation}
                            xOffset={item.xOffset}
                            yOffset={item.yOffset}
                            zIndex={item.offsetIndex} // Just logical Order, CSS handles actual stacking by DOM order
                        />
                    ))}
                </AnimatePresence>
            </div>

            <div style={{ textAlign: 'center', color: '#888', marginTop: '2rem', fontFamily: 'var(--font-mynerve)' }}>
                Swipe to explore memories...
            </div>

            {/* Immersive Modal */}
            {isMounted && document.body && createPortal(
                <AnimatePresence>
                    {selectedEvent && (
                        <motion.div
                            className={styles.overlay}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedEvent(null)}
                        >
                            <motion.div
                                className={styles.modal}
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <button className={styles.closeButton} onClick={() => setSelectedEvent(null)}>✕</button>

                                <div className={styles.modalImageContainer}>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={selectedEvent.image || 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?q=80&w=800&auto=format&fit=crop'}
                                        alt={selectedEvent.title}
                                        className={styles.modalImage}
                                        onError={(e) => {
                                            e.currentTarget.src = 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?q=80&w=800&auto=format&fit=crop';
                                        }}
                                    />
                                </div>

                                <div className={styles.modalContent}>
                                    <h3 className={styles.modalTitle}>{selectedEvent.title}</h3>
                                    <p className={styles.modalDescription}>{selectedEvent.description}</p>
                                    <div style={{ fontSize: '0.9rem', opacity: 0.7, fontFamily: 'var(--font-open-sans)' }}>
                                        {selectedEvent.date}
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </section>
    );
}

interface CardProps {
    event: any;
    isFront: boolean;
    onSwipe: (direction: number) => void;
    onSelect: () => void;
    rotation: number;
    xOffset: number;
    yOffset: number;
    zIndex: number;
}

function Card({ event, isFront, onSwipe, onSelect, rotation, xOffset, yOffset }: CardProps) {
    return (
        <motion.div
            className={styles.card}
            style={{
                cursor: isFront ? 'grab' : 'default',
            }}
            initial={isFront ? false : { opacity: 0, scale: 0.95 }}
            animate={{
                scale: 1,
                opacity: 1,
                rotate: rotation,
                x: xOffset,
                y: yOffset
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            variants={{
                exit: (direction: number) => ({
                    x: direction * 300,
                    opacity: 0,
                    rotate: direction * 40,
                    transition: { duration: 0.3 }
                })
            }}
            exit="exit"
            drag={isFront ? "x" : false} // Only front card is draggable
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            onDragEnd={(_, info) => {
                if (Math.abs(info.offset.x) > 100) {
                    onSwipe(info.offset.x > 0 ? 1 : -1);
                }
            }}
            whileHover={isFront ? { scale: 1.05 } : {}}
            onClick={() => isFront && onSelect()}
            style={{ position: 'absolute' }}
        >
            <div className={styles.cardDate}>{event.date}</div>
            <div className={styles.cardImageContainer}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={event.image || 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?q=80&w=800&auto=format&fit=crop'}
                    alt={event.title}
                    className={styles.cardImage}
                    onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?q=80&w=800&auto=format&fit=crop';
                    }}
                />
            </div>
            <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{event.title}</h3>
            </div>
        </motion.div>
    );
}
