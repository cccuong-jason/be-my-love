"use client";
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useContentStore } from '@/store/contentStore';
import styles from './Journey.module.css';

export default function Journey() {
    const timeline = useContentStore((state) => state.timeline);
    const containerRef = useRef<HTMLDivElement>(null);

    // Scroll progress for the entire section
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    return (
        <section ref={containerRef} className={styles.journeySection}>
            <motion.h2
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={styles.title}
            >
                {timeline.title}
            </motion.h2>

            <div className={styles.timelineContainer}>
                {/* Central Line */}
                <div className={styles.line}></div>

                {timeline.events.map((event, index) => {
                    const isEven = index % 2 === 0;
                    return (
                        <motion.div
                            key={index}
                            className={`${styles.eventRow} ${isEven ? styles.left : styles.right}`}
                            initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                        >
                            <div className={styles.contentBox}>
                                <div className={styles.innerBorder}>
                                    <div className={styles.dateBadge}>{event.date}</div>
                                    {event.image && (
                                        <div className={styles.imageContainer}>
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={event.image} alt={event.title} className={styles.eventImage} />
                                        </div>
                                    )}
                                    <h3>{event.title}</h3>
                                    <p>{event.description}</p>
                                </div>
                            </div>

                            {/* Heart Icon on the line */}
                            <div className={styles.dot}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                </svg>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
}
