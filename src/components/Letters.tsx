"use client";
import { useContentStore } from '@/store/contentStore';
import styles from './Letters.module.css';
import LockableLetter from './LockableLetter';
import { motion } from 'framer-motion';
import ParallaxSection from './ParallaxSection';

export default function Letters() {
    const letters = useContentStore((state) => state.letters);

    return (
        <ParallaxSection className={styles.lettersSection} parallaxDistance={80}>
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={styles.sectionTitle}
            >
                {letters.title}
            </motion.h2>

            <div className={styles.grid}>
                {letters.items.map((letter, index) => (
                    <LockableLetter key={letter.id} letter={letter} index={index} />
                ))}
            </div>
        </ParallaxSection>
    );
}
