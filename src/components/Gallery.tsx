"use client";
import { useState } from 'react';
import styles from './Gallery.module.css';

const photos = [
    { src: "https://picsum.photos/id/10/400/600", alt: "Nature Memory" },
    { src: "https://picsum.photos/id/11/400/600", alt: "Walk in Park" },
    { src: "https://picsum.photos/id/12/400/600", alt: "Beach Day" },
    { src: "https://picsum.photos/id/13/400/600", alt: "Sunset" },
    { src: "https://picsum.photos/id/14/400/600", alt: "Mountain Trip" },
    { src: "https://picsum.photos/id/15/400/600", alt: "Coffee Date" },
];

export default function Gallery() {
    const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

    return (
        <section className={styles.gallery}>
            <h2>Our Memories</h2>
            <div className={styles.grid}>
                {photos.map((photo, index) => (
                    <div
                        key={index}
                        className={styles.card}
                        onClick={() => setSelectedPhoto(photo.src)}
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={photo.src} alt={photo.alt} loading="lazy" />
                    </div>
                ))}
            </div>

            {selectedPhoto && (
                <div className={styles.lightbox} onClick={() => setSelectedPhoto(null)}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={selectedPhoto} alt="Selected Memory" />
                </div>
            )}
        </section>
    );
}
