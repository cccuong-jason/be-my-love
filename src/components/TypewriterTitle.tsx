"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TypewriterTitleProps {
    titles: string[];
    speed?: number;
    pause?: number;
}

export default function TypewriterTitle({ titles, speed = 150, pause = 2000 }: TypewriterTitleProps) {
    const [index, setIndex] = useState(0);
    const [displayText, setDisplayText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const currentTitle = titles[index % titles.length];

        const timer = setTimeout(() => {
            if (!isDeleting) {
                // Typing
                if (displayText.length < currentTitle.length) {
                    setDisplayText(currentTitle.substring(0, displayText.length + 1));
                } else {
                    // Finished typing, wait then delete
                    setTimeout(() => setIsDeleting(true), pause);
                }
            } else {
                // Deleting
                if (displayText.length > 0) {
                    setDisplayText(currentTitle.substring(0, displayText.length - 1));
                } else {
                    // Finished deleting, move to next
                    setIsDeleting(false);
                    setIndex((prev) => prev + 1);
                }
            }
        }, isDeleting ? speed / 2 : speed);

        return () => clearTimeout(timer);
    }, [displayText, isDeleting, index, titles, speed, pause]);

    return (
        <span style={{ display: 'inline-block', minWidth: '20px' }}>
            {displayText}
            <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                style={{ marginLeft: '2px', borderRight: '2px solid currentColor' }}
            />
        </span>
    );
}
