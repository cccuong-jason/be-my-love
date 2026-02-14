"use client";

import styles from './Timeline.module.css';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const events = [
    { date: "Oct 2023", title: "First Met", description: "The moment time stood still." },
    { date: "Nov 2023", title: "First Date", description: "Coffee, laughter, and a spark." },
    { date: "Feb 2024", title: "First Trip", description: "Adventures together begin." },
    { date: "Today", title: "Forever", description: "Writing our story, day by day." },
];

type TimelineEvent = { date: string; title: string; description: string; };

function TimelineItem({ event, index }: { event: TimelineEvent, index: number }) {
    const { ref, isVisible } = useScrollReveal();

    return (
        <div
            ref={ref}
            className={`${styles.item} ${isVisible ? styles.visible : ''} ${index % 2 === 0 ? styles.left : styles.right}`}
        >
            <div className={styles.content}>
                <h3>{event.title}</h3>
                <span className={styles.date}>{event.date}</span>
                <p>{event.description}</p>
            </div>
        </div>
    );
}

export default function Timeline() {
    return (
        <section className={styles.timeline}>
            <h2 className={styles.title}>Our Story</h2>
            <div className={styles.container}>
                {events.map((event, index) => (
                    <TimelineItem key={index} event={event} index={index} />
                ))}
                <div className={styles.line}></div>
            </div>
        </section>
    );
}
