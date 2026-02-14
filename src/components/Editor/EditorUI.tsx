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

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, callback: (val: string) => void) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Server-side upload
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            if (data.url) {
                callback(data.url);
            } else {
                alert("Upload failed: " + data.error);
            }
        } catch (error) {
            console.error(error);
            alert("Upload error!");
        }
    };

    return (
        <>
            <button className={styles.fab} onClick={toggleEditor} title="Customize Content">
                ✎
            </button>

            <div className={`${styles.drawer} ${isEditorOpen ? styles.open : ''}`}>
                <div className={styles.drawerHeader}>
                    <h3>💘 Personalize</h3>
                    <button onClick={toggleEditor} className={styles.closeBtn}>×</button>
                </div>

                <p className={styles.helperText}>
                    Customize texts and images. Changes resolve to the shareable link below.
                </p>

                <div className={styles.accordion}>
                    {/* Couple Section */}
                    <details open className={styles.details}>
                        <summary className={styles.summary}>Couple & Footer</summary>
                        <div className={styles.fieldGroup}>
                            <label>Partner Name (The Valentine)</label>
                            <input
                                className={styles.drawerInput}
                                value={couple.partnerName}
                                onChange={(e) => updateSection('couple', { partnerName: e.target.value })}
                            />
                            <label>Your Name (The Sender)</label>
                            <input
                                className={styles.drawerInput}
                                value={couple.yourName}
                                onChange={(e) => updateSection('couple', { yourName: e.target.value })}
                            />
                        </div>
                    </details>

                    {/* Hero Section */}
                    <details className={styles.details}>
                        <summary className={styles.summary}>Hero Section</summary>
                        <div className={styles.fieldGroup}>
                            <label>Main Title</label>
                            <input
                                className={styles.drawerInput}
                                value={hero.title}
                                onChange={(e) => updateSection('hero', { title: e.target.value })}
                            />
                            <label>Subtitle</label>
                            <input
                                className={styles.drawerInput}
                                value={hero.subtitle}
                                onChange={(e) => updateSection('hero', { subtitle: e.target.value })}
                            />
                        </div>
                    </details>



                    <details className={styles.details}>
                        <summary className={styles.summary}>Our Story (Chronicle)</summary>
                        <div className={styles.fieldGroup}>
                            <label>Section Title</label>
                            <input
                                className={styles.drawerInput}
                                value={timeline.title}
                                onChange={(e) => updateSection('timeline', { title: e.target.value })}
                            />

                            {timeline.events.map((evt: any, i: number) => (
                                <div key={i} className={styles.eventEditBlock}>
                                    <label>Event {i + 1} Title (Click text on page to edit desc)</label>
                                    <input
                                        className={styles.drawerInput}
                                        value={evt.title}
                                        onChange={(e) => {
                                            const newEvts = [...timeline.events];
                                            newEvts[i].title = e.target.value;
                                            updateSection('timeline', { events: newEvts });
                                        }}
                                    />
                                    <div style={{ display: 'flex', gap: '5px' }}>
                                        <input
                                            type="date"
                                            className={styles.drawerInput}
                                            value={evt.date}
                                            style={{ width: '150px' }}
                                            onChange={(e) => {
                                                const newEvts = [...timeline.events];
                                                newEvts[i].date = e.target.value;
                                                updateSection('timeline', { events: newEvts });
                                            }}
                                        />
                                        <input
                                            className={styles.drawerInput}
                                            placeholder="Image URL"
                                            value={evt.image || ''}
                                            onChange={(e) => {
                                                const newEvts = [...timeline.events];
                                                newEvts[i].image = e.target.value;
                                                updateSection('timeline', { events: newEvts });
                                            }}
                                            style={{ flex: 1 }}
                                        />
                                        <label className={styles.fileLabel}>
                                            📷
                                            <input
                                                type="file"
                                                accept="image/*"
                                                hidden
                                                onChange={(e) => handleFileUpload(e, (val) => {
                                                    const newEvts = [...timeline.events];
                                                    newEvts[i].image = val;
                                                    updateSection('timeline', { events: newEvts });
                                                })}
                                            />
                                        </label>
                                    </div>
                                    <hr style={{ margin: '10px 0', borderTop: '1px dashed #eee' }} />
                                </div>
                            ))}
                        </div>
                    </details>

                    {/* Quiz Section */}
                    <details className={styles.details}>
                        <summary className={styles.summary}>Quiz Game</summary>
                        <div className={styles.fieldGroup}>
                            <label>Title</label>
                            <input
                                className={styles.drawerInput}
                                value={quiz.title}
                                onChange={(e) => updateSection('quiz', { title: e.target.value })}
                            />
                            {quiz.questions.map((q, i) => (
                                <div key={i} className={styles.eventEditBlock}>
                                    <label>Question {i + 1}</label>
                                    <input
                                        className={styles.drawerInput}
                                        value={q.question}
                                        onChange={(e) => {
                                            const newQs = [...quiz.questions];
                                            newQs[i].question = e.target.value;
                                            updateSection('quiz', { questions: newQs });
                                        }}
                                    />
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
                                        {q.options.map((opt, optIdx) => (
                                            <input
                                                key={optIdx}
                                                className={styles.drawerInput}
                                                value={opt}
                                                style={{ borderColor: q.answer === optIdx ? 'var(--hot-pink)' : '#e0e0e0' }}
                                                title={q.answer === optIdx ? 'Correct Answer' : 'Option'}
                                                onChange={(e) => {
                                                    const newQs = [...quiz.questions];
                                                    newQs[i].options[optIdx] = e.target.value;
                                                    updateSection('quiz', { questions: newQs });
                                                }}
                                                // Quick way to set answer: double click
                                                onDoubleClick={() => {
                                                    const newQs = [...quiz.questions];
                                                    newQs[i].answer = optIdx;
                                                    updateSection('quiz', { questions: newQs });
                                                }}
                                            />
                                        ))}
                                    </div>
                                    <p className={styles.tinyNote} style={{ textAlign: 'center' }}>Double-click an option to mark it as correct</p>
                                </div>
                            ))}
                        </div>
                    </details>

                    {/* Interactive Section */}
                    <details className={styles.details}>
                        <summary className={styles.summary}>Proposal & Letters</summary>
                        <div className={styles.fieldGroup}>
                            <label>Question</label>
                            <input
                                className={styles.drawerInput}
                                value={interactive.question}
                                onChange={(e) => updateSection('interactive', { question: e.target.value })}
                            />
                            <label>Success Message</label>
                            <input
                                className={styles.drawerInput}
                                value={interactive.successText}
                                onChange={(e) => updateSection('interactive', { successText: e.target.value })}
                            />
                        </div>
                    </details>

                    {/* Music Section */}
                    <details className={styles.details}>
                        <summary className={styles.summary}>Background Music</summary>
                        <div className={styles.fieldGroup}>
                            <label>YouTube Link</label>
                            <input
                                className={styles.drawerInput}
                                value={useContentStore((state) => state.music.url)}
                                placeholder="https://youtube.com/watch?v=..."
                                onChange={(e) => updateSection('music', { url: e.target.value })}
                            />
                            <p className={styles.tinyNote}>Note: Music starts when the "Play" button is clicked.</p>
                        </div>
                    </details>
                </div>

                <div className={styles.footerAction}>
                    <h4>🚀 Share Your Love</h4>
                    <p>Copy the link to send this personalized page.</p>
                    <button
                        className={styles.shareBtn}
                        onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            alert("Link copied! Send it to your valentine! 💌");
                        }}
                    >
                        Copy Shareable Link
                    </button>
                </div>
            </div>
        </>
    );
}
