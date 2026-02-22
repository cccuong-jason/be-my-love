"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import styles from './Letters.module.css';
import { createPortal } from 'react-dom';

interface LockableLetterProps {
    letter: any;
    index: number;
}

export default function LockableLetter({ letter, index }: LockableLetterProps) {
    // Stages: 
    // GIFT: Showing gift box (idle animation)
    // CONTEXT: Correct answer -> Context Image revealed (if exists)
    // LETTER: Letter content unlocked
    const [stage, setStage] = useState<'GIFT' | 'CONTEXT' | 'LETTER'>(
        (letter.isUnlocked || !letter.isLocked) ? 'LETTER' : 'GIFT'
    );
    const [showModal, setShowModal] = useState(false);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [shake, setShake] = useState(false);

    // Portal mounting safety
    const [isMounted, setIsMounted] = useState(false);
    React.useEffect(() => setIsMounted(true), []);

    // Sync state if lock status changes from editor
    React.useEffect(() => {
        if (!letter.isLocked) {
            setStage('LETTER');
            setShowModal(false);
        } else if (letter.isLocked && !letter.isUnlocked) {
            setStage(prev => prev === 'LETTER' ? 'GIFT' : prev);
        }
    }, [letter.isLocked, letter.isUnlocked]);

    const handleOpenQuiz = () => {
        if (stage === 'GIFT') {
            setShowModal(true);
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

            setShowModal(false);

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

    // 3. FLIP CARD (GIFT) & QUIZ MODAL
    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={styles.flipCard}
                onClick={stage === 'GIFT' ? handleOpenQuiz : undefined}
                style={{
                    perspective: '1000px',
                    cursor: stage === 'GIFT' ? 'pointer' : 'default',
                    zIndex: 1
                }}
            >
                <motion.div
                    className={styles.flipInner}
                    animate={{
                        y: (stage === 'GIFT') ? [0, -8, 0] : 0
                    }}
                    transition={{
                        y: { repeat: Infinity, duration: 3, ease: "easeInOut" }
                    }}
                >
                    {/* FRONT — Gift SVG */}
                    <div className={styles.flipFront}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/gift-box-svgrepo-com.svg" alt="Gift Box" />
                        <span className={styles.giftLabel}>{letter.title}</span>
                        <span className={styles.tapHint}>Tap to open</span>
                    </div>
                </motion.div>
            </motion.div>

            {/* QUIZ MODAL PORTAL/OVERLAY */}
            {isMounted && document.body && createPortal(
                <AnimatePresence>
                    {showModal && (
                        <motion.div
                            className={styles.modalOverlay}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowModal(false)}
                        >
                            <motion.div
                                className={styles.modalCard}
                                onClick={(e) => e.stopPropagation()}
                                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                animate={{
                                    scale: 1,
                                    opacity: 1,
                                    y: 0,
                                    x: shake ? [-10, 10, -10, 10, 0] : 0
                                }}
                                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                                transition={{
                                    x: { duration: 0.4 }
                                }}
                            >
                                <button className={styles.closeModalBtn} onClick={() => setShowModal(false)}>
                                    <X size={24} />
                                </button>

                                {letter.contextImage && (
                                    <div style={{ width: '100%', maxHeight: '200px', borderRadius: '12px', overflow: 'hidden', marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={letter.contextImage} alt="Context" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                )}

                                <p className={styles.quizQuestion} style={{ marginTop: letter.contextImage ? '0' : '1rem' }}>
                                    {letter.lockQuestion || "Answer to unlock..."}
                                </p>

                                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
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
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </>
    );
}
