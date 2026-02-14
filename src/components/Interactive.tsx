"use client";
import { useState } from 'react';
import confetti from 'canvas-confetti';
import { useContentStore } from '@/store/contentStore';
import EditableText from './Editor/EditableText';
import styles from './Interactive.module.css';

export default function Interactive() {
    const interactive = useContentStore((state) => state.interactive);
    const [yesSize, setYesSize] = useState(1);
    const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
    const [accepted, setAccepted] = useState(false);
    const [noTextIndex, setNoTextIndex] = useState(0);

    const handleNoHover = () => {
        // Calculate random position within a reasonable range
        const x = Math.random() * 200 - 100; // -100 to 100
        const y = Math.random() * 200 - 100;
        setNoPosition({ x, y });
        setYesSize(prev => Math.min(prev + 0.2, 3)); // Cap size growth

        // Cycle through "No" texts
        setNoTextIndex((prev) => (prev + 1) % interactive.noTexts.length);
    };

    const handleYes = () => {
        setAccepted(true);
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: ReturnType<typeof setInterval> = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            // since particles fall down, start a bit higher than random
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }, shapes: ['heart'] as any, colors: ['#FF69B4', '#FF1493', '#C71585'] });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }, shapes: ['heart'] as any, colors: ['#FF69B4', '#FF1493', '#C71585'] });
        }, 250);
    };

    return (
        <section className={styles.interactive}>
            {!accepted ? (
                <div className={styles.container}>
                    <h2>
                        <EditableText section="interactive" field="question" value={interactive.question} />
                    </h2>
                    <div className={styles.buttons}>
                        <button
                            className={styles.yesButton}
                            style={{ transform: `scale(${yesSize})` }}
                            onClick={handleYes}
                        >
                            <EditableText section="interactive" field="yesText" value={interactive.yesText} />
                        </button>
                        <button
                            className={styles.noButton}
                            style={{ transform: `translate(${noPosition.x}px, ${noPosition.y}px)` }}
                            onMouseEnter={handleNoHover}
                            onTouchStart={handleNoHover}
                            onClick={handleNoHover}
                        >
                            {interactive.noTexts[noTextIndex]}
                        </button>
                    </div>
                </div>
            ) : (
                <div className={styles.success}>
                    <h2>
                        <EditableText section="interactive" field="successTitle" value={interactive.successTitle} />
                    </h2>
                    <p>
                        <EditableText section="interactive" field="successText" value={interactive.successText} />
                    </p>
                </div>
            )}
        </section>
    );
}
