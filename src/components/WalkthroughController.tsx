"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function WalkthroughController({ children }: { children: React.ReactNode }) {
    // We expect children to be an array of full-height sections
    const childrenArray = React.Children.toArray(children);
    const [currentIndex, setCurrentIndex] = useState(0);
    const isScrolling = useRef(false);

    useEffect(() => {
        // Prevent default scrolling on body
        document.documentElement.style.overflow = "hidden";
        document.body.style.overflow = "hidden";

        // Helper to check if any modal is currently blocking the screen
        const isModalOpen = () => document.querySelector('[class*="overlay"], [class*="modalOverlay"]');

        const handleWheel = (e: WheelEvent) => {
            if (isScrolling.current || isModalOpen()) return;

            // Allow small movements to accumulate before triggering to avoid accidental triggers
            if (Math.abs(e.deltaY) < 20) return;

            if (e.deltaY > 0) {
                // Scroll down
                if (currentIndex < childrenArray.length - 1) {
                    isScrolling.current = true;
                    setCurrentIndex(prev => prev + 1);
                    setTimeout(() => isScrolling.current = false, 1200); // lock duration matches + pads the animation
                }
            } else {
                // Scroll up
                if (currentIndex > 0) {
                    isScrolling.current = true;
                    setCurrentIndex(prev => prev - 1);
                    setTimeout(() => isScrolling.current = false, 1200);
                }
            }
        };

        // Touch event handling for mobile devices
        let startY = 0;
        const handleTouchStart = (e: TouchEvent) => {
            startY = e.touches[0].clientY;
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (isModalOpen()) return; // Let the modal handle its own scrolling if necessary
            e.preventDefault(); // Stop native drag only when we're acting as the slider
            if (isScrolling.current) return;

            const currentY = e.touches[0].clientY;
            const diff = startY - currentY;

            if (Math.abs(diff) > 40) { // Drag threshold
                if (diff > 0 && currentIndex < childrenArray.length - 1) {
                    isScrolling.current = true;
                    setCurrentIndex(prev => prev + 1);
                    setTimeout(() => isScrolling.current = false, 1200);
                } else if (diff < 0 && currentIndex > 0) {
                    isScrolling.current = true;
                    setCurrentIndex(prev => prev - 1);
                    setTimeout(() => isScrolling.current = false, 1200);
                }
                startY = currentY; // reset to avoid continuous trigger
            }
        };

        window.addEventListener("wheel", handleWheel, { passive: false });
        window.addEventListener("touchstart", handleTouchStart, { passive: false });
        // { passive: false } is required for e.preventDefault() to work on touchmove iOS
        window.addEventListener("touchmove", handleTouchMove, { passive: false });

        return () => {
            document.documentElement.style.overflow = "";
            document.body.style.overflow = "";
            window.removeEventListener("wheel", handleWheel);
            window.removeEventListener("touchstart", handleTouchStart);
            window.removeEventListener("touchmove", handleTouchMove);
        };
    }, [currentIndex, childrenArray.length]);

    return (
        <motion.div
            style={{ width: '100vw', display: 'flex', flexDirection: 'column' }}
            animate={{
                y: `-${currentIndex * 100}vh`
            }}
            transition={{
                duration: 1.0,
                // anticipation curve pulls back slightly, pauses, then smoothly accelerates forward. 
                ease: "anticipate"
            }}
        >
            {childrenArray.map((child, index) => (
                <div key={index} style={{
                    width: '100%', height: '100vh', flexShrink: 0, position: 'relative', overflow: 'hidden',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                }}>
                    {child}
                </div>
            ))}
        </motion.div>
    );
}
