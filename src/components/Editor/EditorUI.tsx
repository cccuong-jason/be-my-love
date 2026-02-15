"use client";
import { useState } from 'react';
import { useContentStore } from '@/store/contentStore';
import styles from './Editor.module.css';

export default function EditorUI() {
    const isEditorOpen = useContentStore((state) => state.isEditorOpen);
    const toggleEditor = useContentStore((state) => state.toggleEditor);
    const updateSection = useContentStore((state) => state.updateSection);

    // Selectors
    const hero = useContentStore((state) => state.hero);
    const couple = useContentStore((state) => state.couple);
    const timeline = useContentStore((state) => state.timeline);
    const quiz = useContentStore((state) => state.quiz);
    const letters = useContentStore((state) => state.letters);
    const interactive = useContentStore((state) => state.interactive);

    // Public Mode Check
    const [searchParams] = useState(() => typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams());
    const isPublic = searchParams.get('public') === 'true';

    // Handler for sharing
    const handleShare = () => {
        const url = new URL(window.location.href);
        url.searchParams.set('public', 'true');
        navigator.clipboard.writeText(url.toString());
        alert("Public link copied! 💌\nSend this version to disable editing.");
    };

    const handleFileUpload = (e: any, onComplete: (val: string) => void) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            if (reader.result && typeof reader.result === 'string') {
                onComplete(reader.result);
            }
        };
        reader.readAsDataURL(file);
    };

    if (isPublic) return null; // Hide everything in public mode

    return (
        <>
            <button className={styles.fab} onClick={toggleEditor} title="Customize Content">
                <span style={{ fontSize: '1.5rem' }}>✨</span>
            </button>

            <div className={`${styles.drawer} ${isEditorOpen ? styles.open : ''}`}>
                <div className={styles.drawerHeader}>
                    <h3>✨ Design Your Love</h3>
                    <button onClick={toggleEditor} className={styles.closeBtn}>×</button>
                </div>

                <div className={styles.accordion}>
                    {/* Modernized Inputs using loop or simple clean blocks */}

                    {/* Couple Section */}
                    <div className={styles.modernGroup}>
                        <h4>Couple Names</h4>
                        <div className={styles.inputRow}>
                            <div className={styles.floatingInput}>
                                <input
                                    placeholder=" "
                                    value={couple.partnerName}
                                    onChange={(e) => updateSection('couple', { partnerName: e.target.value })}
                                />
                                <label>Partner Name</label>
                            </div>
                            <div className={styles.floatingInput}>
                                <input
                                    placeholder=" "
                                    value={couple.yourName}
                                    onChange={(e) => updateSection('couple', { yourName: e.target.value })}
                                />
                                <label>Your Name</label>
                            </div>
                        </div>
                    </div>

                    {/* Hero Section */}
                    <div className={styles.modernGroup}>
                        <h4>Hero Texts</h4>
                        <div className={styles.floatingInput}>
                            <input
                                placeholder=" "
                                value={hero.title}
                                onChange={(e) => updateSection('hero', { title: e.target.value })}
                            />
                            <label>Main Title</label>
                        </div>
                        <div className={styles.floatingInput}>
                            <input
                                placeholder=" "
                                value={hero.subtitle}
                                onChange={(e) => updateSection('hero', { subtitle: e.target.value })}
                            />
                            <label>Subtitle</label>
                        </div>
                    </div>

                    {/* Story Section */}
                    <div className={styles.modernGroup}>
                        <h4>Our Perspective</h4>
                        <div className={styles.floatingInput}>
                            <input
                                placeholder=" "
                                value={timeline.title}
                                onChange={(e) => updateSection('timeline', { title: e.target.value })}
                            />
                            <label>Timeline Title</label>
                        </div>

                        {timeline.events.map((evt: any, i: number) => (
                            <div key={i} className={styles.cardEdit}>
                                <span className={styles.cardIndex}>#{i + 1}</span>
                                <input
                                    className={styles.cleanInput}
                                    value={evt.title}
                                    placeholder="Event Title"
                                    onChange={(e) => {
                                        const newEvts = [...timeline.events];
                                        newEvts[i].title = e.target.value;
                                        updateSection('timeline', { events: newEvts });
                                    }}
                                />
                                <div className={styles.dateAndImg}>
                                    <input
                                        type="date"
                                        className={styles.cleanInput}
                                        value={evt.date}
                                        onChange={(e) => {
                                            const newEvts = [...timeline.events];
                                            newEvts[i].date = e.target.value;
                                            updateSection('timeline', { events: newEvts });
                                        }}
                                    />
                                    <label className={styles.uploadBtn}>
                                        Upload
                                        <input
                                            type="file"
                                            hidden
                                            onChange={(e) => handleFileUpload(e, (val) => {
                                                const newEvts = [...timeline.events];
                                                newEvts[i].image = val;
                                                updateSection('timeline', { events: newEvts });
                                            })}
                                        />
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Music Section */}
                    <div className={styles.modernGroup}>
                        <h4>Background Music</h4>
                        <div className={styles.floatingInput}>
                            <input
                                placeholder=" "
                                value={useContentStore((state) => state.music.url)}
                                onChange={(e) => updateSection('music', { url: e.target.value })}
                            />
                            <label>YouTube Link</label>
                        </div>
                    </div>
                </div>

                <div className={styles.footerAction}>
                    <button className={styles.shareBtn} onClick={handleShare}>
                        🚀 Publish & Share
                    </button>
                    <p className={styles.shareHint}>Generates a public view-only link.</p>
                </div>
            </div>
        </>
    );
}
