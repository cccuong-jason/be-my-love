"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import styles from './Letters.module.css';

interface LockableLetterProps {
    letter: any;
    index: number;
}

export default function LockableLetter({ letter, index }: LockableLetterProps) {
    // Stages: 
    // GIFT: Showing gift box (idle animation)
    // QUIZ: Flipped to show quiz
    // CONTEXT: Correct answer -> Context Image revealed (if exists)
    // LETTER: Letter content unlocked

    const [stage, setStage] = useState<'GIFT' | 'QUIZ' | 'CONTEXT' | 'LETTER'>(
        (letter.isUnlocked || !letter.isLocked) ? 'LETTER' : 'GIFT'
    );
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [shake, setShake] = useState(false);

    const handleFlip = () => {
        if (stage === 'GIFT') {
            setStage('QUIZ');
        }
    };

    const handleAnswer = () => {
        if (selectedOption === null) return;

        // Robust check: compare index OR string value just in case data is mixed
        const isCorrectIndex = Number(selectedOption) === Number(letter.lockAnswer);
        const isCorrectValue = letter.lockOptions && letter.lockOptions[selectedOption] === letter.lockAnswer;

        if (isCorrectIndex || isCorrectValue) {
            confetti({
                particleCount: 150,
                spread: 100,
                origin: { y: 0.6 },
                colors: ['#ff69b4', '#ff4d4d', '#ffffff', '#ffd700']
            });

            // If context image exists, show it first, otherwise go straight to letter
            if (letter.contextImage) {
                setStage('CONTEXT');
                setTimeout(() => setStage('LETTER'), 1500); // Reduced from 3500ms -> 1.5s
            } else {
                setStage('LETTER');
            }
        } else {
            setShake(true);
            setTimeout(() => setShake(false), 500);
        }
    };

    // 1. UNLOCKED LETTER CARD
    if (stage === 'LETTER') {
        return (
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", bounce: 0.4 }}
                className={styles.letterCard}
                style={{ backgroundColor: letter.color }}
            >
                <h3>{letter.title}</h3>
                <p>{letter.content}</p>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.75rem' }}>
                    <Heart size={16} fill="#ff4d4d" stroke="none" />
                </div>
            </motion.div>
        );
    }

    // 2. CONTEXT IMAGE REVEAL
    if (stage === 'CONTEXT' && letter.contextImage) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.5 }} // Faster fade in
                style={{
                    width: '300px',
                    height: '350px',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                    position: 'relative'
                }}
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={letter.contextImage}
                    alt="Memory"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    padding: '1rem', background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                    color: 'white', textAlign: 'center', fontFamily: 'var(--font-mynerve)'
                }}>
                    Unlocked Memory ✨
                </div>
            </motion.div>
        );
    }

    // 3. FLIP CARD (GIFT <-> QUIZ)
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className={styles.flipCard}
            onClick={stage === 'GIFT' ? handleFlip : undefined}
            style={{
                perspective: '1000px',
                cursor: stage === 'GIFT' ? 'pointer' : 'default',
                zIndex: stage === 'QUIZ' ? 10 : 1
            }}
        >
            <motion.div
                className={styles.flipInner}
                animate={{
                    rotateY: stage === 'QUIZ' ? 180 : 0,
                    x: shake ? [-10, 10, -10, 10, 0] : 0,
                    y: (stage === 'GIFT' && !shake) ? [0, -8, 0] : 0
                }}
                transition={{
                    rotateY: { duration: 0.4, ease: "easeInOut" }, // Faster flip (0.8 -> 0.4)
                    y: { repeat: Infinity, duration: 3, ease: "easeInOut" },
                    x: { duration: 0.4 }
                }}
            >
                {/* FRONT — Gift SVG */}
                <div className={styles.flipFront}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/gift-box-svgrepo-com.svg" alt="Gift Box" />
                    <span className={styles.giftLabel}>{letter.title}</span>
                    <span className={styles.tapHint}>👆 Tap to open</span>
                </div>

                {/* BACK — Quiz */}
                <div className={styles.flipBack} onClick={(e) => e.stopPropagation()}>
                    <p className={styles.quizQuestion}>
                        {letter.lockQuestion || "Answer to unlock..."}
                    </p>
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {letter.lockOptions?.map((opt: string, i: number) => (
                            <button
                                key={i}
                                className={`${styles.optionBtn} ${selectedOption === i ? styles.selected : ''}`}
                                onClick={() => setSelectedOption(i)}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                    <button
                        className={styles.submitBtn}
                        disabled={selectedOption === null}
                        onClick={handleAnswer}
                    >
                        Confirm Answer
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}
