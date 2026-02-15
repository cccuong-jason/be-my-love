"use client";
import { useState } from 'react';
import confetti from 'canvas-confetti';
import styles from './Letters.module.css';

import { useContentStore } from '@/store/contentStore';

export default function Letters() {
    const letters = useContentStore((state) => state.letters);
    const [openId, setOpenId] = useState<number | null>(null);

    const handleOpen = (id: number) => {
        if (openId === id) {
            setOpenId(null); // Toggle close
            return;
        }
        setOpenId(id);
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#FF69B4', '#FFC0CB', '#FFD700'],
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            shapes: ['heart' as any],
        });
    };

    return (
        <section className={styles.letters}>
            <h2>{letters.title}</h2>
            <div className={styles.container}>
                {letters.items.map((letter) => (
                    <div
                        key={letter.id}
                        className={`${styles.envelopeContainer} ${openId === letter.id ? styles.open : ''}`}
                        onClick={() => handleOpen(letter.id)}
                    >
                        <div className={styles.envelopeBody} style={{ '--bg-color': letter.color } as React.CSSProperties}>
                            <div className={styles.flap}></div>
                            <div className={styles.pocket}></div>
                            <div className={styles.letterContent}>
                                <h3>{letter.title}</h3>
                                <p>{letter.content}</p>
                            </div>
                            <div className={styles.seal}>❤</div>
                            <div className={styles.frontLabel}>{letter.title}</div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
