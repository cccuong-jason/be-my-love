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

                            {/* Heart Dot on the line */}
                            <div className={styles.dot}>❤</div>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
}
