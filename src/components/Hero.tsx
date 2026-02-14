"use client";
import dynamic from 'next/dynamic';
import styles from './Hero.module.css';

const Heart3D = dynamic(() => import('./Heart3D'), {
    ssr: false,
    loading: () => null
});

import { useContentStore } from '@/store/contentStore';
import EditableText from './Editor/EditableText';

// ... inside component
export default function Hero() {
    const hero = useContentStore((state) => state.hero);
    const couple = useContentStore((state) => state.couple);

    return (
        <section className={styles.hero}>
            <div className={styles.content}>
                <h1>
                    <EditableText section="hero" field="title" value={hero.title} />
                </h1>
                <h2 style={{ fontSize: '2rem', color: 'var(--hot-pink)', margin: '0.5rem 0' }}>
                    <EditableText section="couple" field="partnerName" value={couple.partnerName} />
                    {' & '}
                    <EditableText section="couple" field="yourName" value={couple.yourName} />
                </h2>
                <p>
                    <EditableText section="hero" field="subtitle" value={hero.subtitle} />
                </p>
            </div>
            <div className={styles.canvasContainer}>
                <Heart3D />
            </div>
        </section>
    );
}
