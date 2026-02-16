"use client";
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import styles from './Hero.module.css';
import TypewriterTitle from './TypewriterTitle';
import ParallaxSection from './ParallaxSection';

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
        <ParallaxSection className={styles.hero} parallaxDistance={50}>
            <div className={styles.content}>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className={styles.title}
                >
                    <TypewriterTitle titles={[hero.title, "My Love", "My Valentine", "My Everything"]} />
                </motion.h1>
                <h2 style={{ fontSize: '2rem', color: 'var(--hot-pink)', margin: '0.5rem 0' }}>
                    <EditableText section="couple" field="partnerName" value={couple.partnerName} />
                    {' & '}
                    <EditableText section="couple" field="yourName" value={couple.yourName} />
                </h2>
                <p>
                    <EditableText section="hero" field="subtitle" value={hero.subtitle} />
                </p>

            </div>
        </ParallaxSection>
    );
}
