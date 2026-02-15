"use client";
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';

interface Pop {
    id: number;
    x: number;
    y: number;
}

export default function HeartPop() {
    const [pops, setPops] = useState<Pop[]>([]);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const id = Date.now();
            setPops((prev) => [...prev, { id, x: e.clientX, y: e.clientY }]);

            // Cleanup
            setTimeout(() => {
                setPops((prev) => prev.filter((p) => p.id !== id));
            }, 1000);
        };

        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, []);

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 9999 }}>
            <AnimatePresence>
                {pops.map((pop) => (
                    <motion.div
                        key={pop.id}
                        initial={{ opacity: 1, scale: 0, y: 0 }}
                        animate={{ opacity: 0, scale: 2, y: -50 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8 }}
                        style={{
                            position: 'absolute',
                            left: pop.x,
                            top: pop.y,
                            fontSize: '2rem',
                            color: '#FF69B4',
                            transform: 'translate(-50%, -50%)'
                        }}
                    >
                        <Heart fill="#FF69B4" stroke="#FF69B4" />
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
