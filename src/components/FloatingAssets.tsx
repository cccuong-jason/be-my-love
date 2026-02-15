"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const assets = [
    {
        id: 1,
        type: 'letter',
        svg: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
                <path d="M12 13l0 0" fill="red"></path> {/* Heart seal hint */}
            </svg>
        ),
        color: '#ff69b4'
    },
    {
        id: 2,
        type: 'gift',
        svg: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 12 20 22 4 22 4 12"></polyline>
                <rect x="2" y="7" width="20" height="5"></rect>
                <line x1="12" y1="22" x2="12" y2="7"></line>
                <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
                <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
            </svg>
        ),
        color: '#ff69b4'
    },
    {
        id: 3,
        type: 'heart',
        svg: (
            <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
        ),
        color: '#f5a7a7ff'
    }
];

export default function FloatingAssets() {
    // Render multiple instances of assets floating around
    const [elements, setElements] = useState<any[]>([]);

    useEffect(() => {
        const newElements = [];
        for (let i = 0; i < 10; i++) { // Increased count slightly
            const randomAsset = assets[Math.floor(Math.random() * assets.length)];
            newElements.push({
                ...randomAsset,
                id: i,
                x: Math.random() * 100,
                y: Math.random() * 100,
                scale: 0.5 + Math.random() * 0.8,
                duration: 15 + Math.random() * 20,
                delay: Math.random() * 10
            });
        }
        setElements(newElements);
    }, []);

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
            {elements.map((el) => (
                <motion.div
                    key={el.id}
                    style={{
                        position: 'absolute',
                        left: `${el.x}%`,
                        top: `${el.y}%`,
                        color: el.color,
                        width: '40px',
                        height: '40px'
                    }}
                    animate={{
                        y: [0, -100, 0],
                        x: [0, 50, -50, 0],
                        rotate: [0, 180, 360],
                        opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{
                        duration: el.duration,
                        repeat: Infinity,
                        ease: "linear",
                        delay: el.delay
                    }}
                >
                    {el.svg}
                </motion.div>
            ))}
        </div>
    );
}
