"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import styles from "./Games.module.css";
import Image from "next/image";

export type KittyMood = "idle" | "correct" | "wrong" | "celebrate";

const kittyImages = {
    idle: "/kitties/kitty-excited.png",
    correct: "/kitties/kitty-heart.png",
    wrong: "/kitties/kitty-happy.png",
};

const moodAnimations: Record<Exclude<KittyMood, "celebrate">, object> = {
    idle: {
        y: [0, -8, 0],
        rotate: [0, 3, -3, 0],
    },
    correct: {
        y: [0, -20, 0],
        scale: [1, 1.3, 1],
        rotate: [0, -10, 10, 0],
    },
    wrong: {
        x: [0, -8, 8, -6, 6, -3, 3, 0],
        rotate: [0, -5, 5, -3, 3, 0],
        scale: [1, 0.9, 1],
    },
};

const moodTransitions: Record<Exclude<KittyMood, "celebrate">, object> = {
    idle: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
    },
    correct: {
        duration: 0.6,
        repeat: 2,
        ease: "easeOut",
    },
    wrong: {
        duration: 0.5,
        ease: "easeInOut",
    },
};

// Pre-computed offsets to avoid Math.random() during render (causes hydration mismatch)
const heartOffsets = [
    { y: -72, x: -18 },
    { y: -85, x: 12 },
    { y: -65, x: -25 },
    { y: -92, x: 20 },
    { y: -78, x: -8 },
];

// Small floating hearts that appear on correct answer
function FloatingHearts() {
    return (
        <div className={styles.floatingHeartsContainer}>
            {heartOffsets.map((offset, i) => (
                <motion.span
                    key={i}
                    className={styles.floatingHeart}
                    initial={{ opacity: 0, y: 0, x: 0, scale: 0 }}
                    animate={{
                        opacity: [0, 1, 0],
                        y: offset.y,
                        x: offset.x,
                        scale: [0, 1, 0.5],
                    }}
                    transition={{
                        duration: 1.2,
                        delay: i * 0.15,
                        ease: "easeOut",
                    }}
                >
                    💖
                </motion.span>
            ))}
        </div>
    );
}

// Single kitty reaction (used in quiz card)
export default function KittyReaction({ mood }: { mood: KittyMood }) {
    if (mood === "celebrate") {
        return <KittyParade />;
    }

    return (
        <div className={styles.kittyContainer}>
            <AnimatePresence mode="wait">
                <motion.div
                    key={mood}
                    className={styles.kittyWrapper}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                        ...moodAnimations[mood],
                    }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={moodTransitions[mood]}
                >
                    <Image
                        src={kittyImages[mood]}
                        alt={`Kitty ${mood}`}
                        width={80}
                        height={80}
                        className={styles.kittyImage}
                        unoptimized
                    />
                </motion.div>
            </AnimatePresence>
            <AnimatePresence>
                {mood === "correct" && <FloatingHearts />}
            </AnimatePresence>
        </div>
    );
}

// Parade of kitties on win screen
export function KittyParade() {
    const paradeKitties = [
        { src: "/kitties/kitty-happy.png", alt: "Happy Kitty", delay: 0 },
        { src: "/kitties/kitty-heart.png", alt: "Heart Kitty", delay: 0.2 },
        { src: "/kitties/kitty-excited.png", alt: "Excited Kitty", delay: 0.4 },
    ];

    return (
        <div className={styles.kittyParade}>
            {paradeKitties.map((kitty, i) => (
                <motion.div
                    key={kitty.alt}
                    initial={{ opacity: 0, y: 30, scale: 0 }}
                    animate={{
                        opacity: 1,
                        y: [0, -12, 0],
                        scale: 1,
                        rotate: [0, i % 2 === 0 ? 10 : -10, 0],
                    }}
                    transition={{
                        opacity: { duration: 0.4, delay: kitty.delay },
                        scale: { duration: 0.4, delay: kitty.delay },
                        y: {
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: kitty.delay + 0.4,
                        },
                        rotate: {
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: kitty.delay + 0.4,
                        },
                    }}
                    className={styles.paradeKitty}
                >
                    <Image
                        src={kitty.src}
                        alt={kitty.alt}
                        width={90}
                        height={90}
                        className={styles.kittyImage}
                        unoptimized
                    />
                </motion.div>
            ))}
        </div>
    );
}
