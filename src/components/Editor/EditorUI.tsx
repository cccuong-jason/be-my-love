"use client";
import { useState, useEffect } from 'react';
import { useContentStore } from '@/store/contentStore';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Editor.module.css';

// Smooth Accordion Component
const AccordionItem = ({ title, children, defaultOpen = false }: { title: string, children: React.ReactNode, defaultOpen?: boolean }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className={styles.modernGroup} style={{ border: '1px solid #eee', borderRadius: '12px', overflow: 'hidden', marginBottom: '1.5rem' }}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    padding: '1rem',
                    background: '#fafafa',
                    cursor: 'pointer',
                    fontWeight: 700,
                    color: 'var(--hot-pink)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    userSelect: 'none'
                }}
            >
                {title}
                <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ fontSize: '1.2rem', color: '#999', display: 'block' }}
                >
                    ▼
                </motion.span>
            </div>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        style={{ overflow: "hidden" }}
                    >
                        <div className={styles.accordionContent}>
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default function EditorUI() {
    const isEditorOpen = useContentStore((state) => state.isEditorOpen);
    const toggleEditor = useContentStore((state) => state.toggleEditor);
    const updateSection = useContentStore((state) => state.updateSection);
    const setFullState = useContentStore((state) => state.setFullState);

    // Selectors
    const hero = useContentStore((state) => state.hero);
    const couple = useContentStore((state) => state.couple);
    const timeline = useContentStore((state) => state.timeline);
    const quiz = useContentStore((state) => state.quiz);

    // Effectiveness check: Ensure all items have IDs for animation
    useEffect(() => {
        let changed = false;
        const newEvents = timeline.events.map(evt => {
            if (!evt.id) {
                changed = true;
                return { ...evt, id: crypto.randomUUID() };
            }
            return evt;
        });

        if (changed) {
            updateSection('timeline', { events: newEvents });
        }
    }, [timeline.events, updateSection]);

    // Public Mode Check
    const [searchParams] = useState(() => typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams());
    const isPublic = searchParams.get('public') === 'true';

    // Custom Slug State
    const [customSlug, setCustomSlug] = useState("");

    // Handler for sharing
    const handleShare = () => {
        const url = new URL(window.location.href);
        url.searchParams.set('public', 'true');

        if (customSlug.trim()) {
            const slug = customSlug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
            url.searchParams.set('to', slug);
        }

        window.open(url.toString(), '_blank');
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

    if (isPublic) return null;

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

                    <AccordionItem title="Couple Names" defaultOpen>
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
                    </AccordionItem>

                    <AccordionItem title="Hero Texts">
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
                    </AccordionItem>

                    <AccordionItem title="Our Perspective (Timeline)" defaultOpen>
                        <div className={styles.floatingInput}>
                            <input
                                placeholder=" "
                                value={timeline.title}
                                onChange={(e) => updateSection('timeline', { title: e.target.value })}
                            />
                            <label>Timeline Title</label>
                        </div>

                        <AnimatePresence mode='popLayout'>
                            {timeline.events.map((evt: any, i: number) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.2 }}
                                    key={evt.id}
                                    className={styles.cardEdit}
                                >
                                    <div className={styles.controlRow}>
                                        <span className={styles.cardIndex}>#{i + 1}</span>
                                        <div style={{ flex: 1 }}></div>
                                        <button
                                            className={styles.controlBtn}
                                            onClick={() => {
                                                if (i === 0) return;
                                                const newEvts = [...timeline.events];
                                                [newEvts[i - 1], newEvts[i]] = [newEvts[i], newEvts[i - 1]];
                                                updateSection('timeline', { events: newEvts });
                                            }}
                                            disabled={i === 0}
                                            title="Move Up"
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
                                        </button>
                                        <button
                                            className={styles.controlBtn}
                                            onClick={() => {
                                                if (i === timeline.events.length - 1) return;
                                                const newEvts = [...timeline.events];
                                                [newEvts[i + 1], newEvts[i]] = [newEvts[i], newEvts[i + 1]];
                                                updateSection('timeline', { events: newEvts });
                                            }}
                                            disabled={i === timeline.events.length - 1}
                                            title="Move Down"
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M19 12l-7 7-7-7" /></svg>
                                        </button>
                                        <button
                                            className={`${styles.controlBtn} ${styles.danger}`}
                                            onClick={() => {
                                                if (confirm("Delete this event?")) {
                                                    const newEvts = timeline.events.filter((_: any, idx: number) => idx !== i);
                                                    updateSection('timeline', { events: newEvts });
                                                }
                                            }}
                                            title="Delete Event"
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" /></svg>
                                        </button>
                                    </div>

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

                                    <textarea
                                        className={styles.cleanInput}
                                        value={evt.description || ""}
                                        placeholder="Description..."
                                        rows={2}
                                        style={{ marginTop: '0.5rem', resize: 'vertical', minHeight: '60px' }}
                                        onChange={(e) => {
                                            const newEvts = [...timeline.events];
                                            newEvts[i].description = e.target.value;
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
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        <button
                            className={styles.addBtn}
                            onClick={() => {
                                const newEvts = [...timeline.events, {
                                    id: crypto.randomUUID(),
                                    date: new Date().toISOString().split('T')[0],
                                    title: "New Memory",
                                    description: "",
                                    image: ""
                                }];
                                updateSection('timeline', { events: newEvts });
                            }}
                        >
                            + Add New Memory
                        </button>
                    </AccordionItem>

                    <AccordionItem title="Quiz Settings" defaultOpen>
                        <div className={styles.floatingInput}>
                            <input
                                placeholder=" "
                                value={quiz.title}
                                onChange={(e) => updateSection('quiz', { title: e.target.value })}
                            />
                            <label>Quiz Title</label>
                        </div>

                        {quiz.questions.map((q: any, i: number) => (
                            <div key={i} className={styles.cardEdit}>
                                <div className={styles.controlRow}>
                                    <span className={styles.cardIndex}>Q{i + 1}</span>
                                    <div style={{ flex: 1 }}></div>
                                    <button
                                        className={`${styles.controlBtn} ${styles.danger}`}
                                        onClick={() => {
                                            if (confirm("Delete this question?")) {
                                                const newQs = quiz.questions.filter((_: any, idx: number) => idx !== i);
                                                updateSection('quiz', { questions: newQs });
                                            }
                                        }}
                                        title="Delete Question"
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" /></svg>
                                    </button>
                                </div>

                                <input
                                    className={styles.cleanInput}
                                    value={q.question}
                                    placeholder="Question Text"
                                    onChange={(e) => {
                                        const newQs = [...quiz.questions];
                                        newQs[i].question = e.target.value;
                                        updateSection('quiz', { questions: newQs });
                                    }}
                                />

                                <div style={{ margin: '1rem 0' }}>
                                    <label style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem', display: 'block' }}>Options (Select Correct Answer)</label>
                                    {q.options.map((opt: string, optIdx: number) => (
                                        <div key={optIdx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                                            <input
                                                type="radio"
                                                name={`q-${i}-ans`}
                                                checked={q.answer === optIdx}
                                                onChange={() => {
                                                    const newQs = [...quiz.questions];
                                                    newQs[i].answer = optIdx;
                                                    updateSection('quiz', { questions: newQs });
                                                }}
                                            />
                                            <input
                                                className={styles.cleanInput}
                                                value={opt}
                                                placeholder={`Option ${optIdx + 1}`}
                                                style={{ marginBottom: 0 }}
                                                onChange={(e) => {
                                                    const newQs = [...quiz.questions];
                                                    newQs[i].options[optIdx] = e.target.value;
                                                    updateSection('quiz', { questions: newQs });
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>

                                <div className={styles.inputRow}>
                                    <div className={styles.floatingInput}>
                                        <input
                                            placeholder=" "
                                            value={q.celebration || ""}
                                            onChange={(e) => {
                                                const newQs = [...quiz.questions];
                                                newQs[i].celebration = e.target.value;
                                                updateSection('quiz', { questions: newQs });
                                            }}
                                        />
                                        <label>Success Message (Toast)</label>
                                    </div>
                                </div>

                                <div className={styles.dateAndImg}>
                                    <label className={styles.uploadBtn}>
                                        {q.image ? "Change Image" : "Upload Image"}
                                        <input
                                            type="file"
                                            hidden
                                            onChange={(e) => handleFileUpload(e, (val) => {
                                                const newQs = [...quiz.questions];
                                                newQs[i].image = val;
                                                updateSection('quiz', { questions: newQs });
                                            })}
                                        />
                                    </label>
                                    {q.image && <span style={{ fontSize: '0.8rem', color: 'var(--hot-pink)' }}>Image Set ✓</span>}
                                </div>
                            </div>
                        ))}

                        <button
                            className={styles.addBtn}
                            onClick={() => {
                                const newQs = [...quiz.questions, {
                                    question: "New Question?",
                                    options: ["Option 1", "Option 2", "Option 3", "Option 4"],
                                    answer: 0,
                                    celebration: "Correct!",
                                    image: ""
                                }];
                                updateSection('quiz', { questions: newQs });
                            }}
                        >
                            + Add Question
                        </button>
                    </AccordionItem>

                    <AccordionItem title="Background Music">
                        <div className={styles.floatingInput}>
                            <input
                                placeholder=" "
                                value={useContentStore((state) => state.music.url)}
                                onChange={(e) => updateSection('music', { url: e.target.value })}
                            />
                            <label>YouTube Link</label>
                        </div>
                    </AccordionItem>

                    <AccordionItem title="Sharing">
                        <div className={styles.floatingInput}>
                            <input
                                placeholder=" "
                                value={customSlug}
                                onChange={(e) => setCustomSlug(e.target.value)}
                            />
                            <label>Custom Link Name (optional)</label>
                        </div>
                    </AccordionItem>

                </div>

                <div className={styles.footerAction}>
                    <button className={styles.shareBtn} onClick={handleShare}>
                        🚀 Publish & Share
                    </button>
                    <p className={styles.shareHint}>Opens your personalized love page in a new tab.</p>
                </div>
            </div>
        </>
    );
}
