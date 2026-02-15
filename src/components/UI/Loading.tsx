"use client";
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';

interface LoadingProps {
    isLoading: boolean;
    fullscreen?: boolean;
    message?: string;
}

export default function Loading({ isLoading, fullscreen = true, message = "Just a moment..." }: LoadingProps) {
    if (!isLoading) return null;

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                        position: fullscreen ? 'fixed' : 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        zIndex: 9999, // Above almost everything
                        background: fullscreen ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.6)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backdropFilter: 'blur(4px)',
                    }}
                >
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 5, -5, 0]
                        }}
                        transition={{
                            duration: 1.5,
                            ease: "easeInOut",
                            repeat: Infinity,
                        }}
                    >
                        <Heart size={64} fill="#ff4d4d" stroke="#ff4d4d" />
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        style={{
                            marginTop: '20px',
                            fontSize: '1.2rem',
                            fontWeight: 600,
                            color: '#ff4d4d',
                            fontFamily: 'var(--font-mynerve)',
                        }}
                    >
                        {message}
                    </motion.p>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
