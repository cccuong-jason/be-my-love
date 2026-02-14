"use client";
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ScrollIndicator() {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            // Hide if near bottom
            const scrollHeight = document.documentElement.scrollHeight;
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const clientHeight = document.documentElement.clientHeight;

            if (scrollTop + clientHeight >= scrollHeight - 50) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.7, y: [0, 10, 0] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    style={{
                        position: 'fixed',
                        bottom: '100px', // Above FAB
                        left: '50%',
                        transform: 'translateX(-50%)',
                        color: 'var(--hot-pink)',
                        fontSize: '2rem',
                        zIndex: 900,
                        pointerEvents: 'none'
                    }}
                >
                    ⌄
                </motion.div>
            )}
        </AnimatePresence>
    );
}
