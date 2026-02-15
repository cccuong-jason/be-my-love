import { useState, useEffect } from 'react';
import { useContentStore } from '@/store/contentStore';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Editor.module.css';
import { Wand2, X, ChevronDown, Check, Save, Share2, Copy, ExternalLink } from 'lucide-react';
import { usePathname } from 'next/navigation';
import ToastContainer, { ToastMessage, ToastType } from '../UI/Toast';
import Loading from '../UI/Loading';

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
                    <ChevronDown size={20} />
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
    const letters = useContentStore((state) => state.letters);
    const musicUrl = useContentStore((state) => state.music.url);

    // UI Feedback State
    const [toasts, setToasts] = useState<ToastMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("Just a moment...");

    const addToast = (message: string, type: ToastType = 'info') => {
        const id = crypto.randomUUID();
        setToasts(prev => [...prev, { id, message, type }]);
    };

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

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

    // Public Mode Check - use pathname only for initial render to avoid hydration mismatch
    const pathname = usePathname();
    const [isPublic, setIsPublic] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        setIsPublic(params.get('public') === 'true');
    }, [pathname]);

    // Custom Slug State - Initialize from store if available
    const storedSlug = useContentStore((state) => state.slug);
    const [customSlug, setCustomSlug] = useState(storedSlug || "");

    // Update local state when store changes (hydration)
    useEffect(() => {
        if (storedSlug) setCustomSlug(storedSlug);
    }, [storedSlug]);

    // Handler for saving
    const handleSave = async () => {
        setIsLoading(true);
        setLoadingMessage("Saving your love story...");

        let targetSlug = customSlug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
        if (!targetSlug) {
            targetSlug = crypto.randomUUID().slice(0, 8);
        }
        setCustomSlug(targetSlug);

        const state = useContentStore.getState();
        const exportData = {
            hero: state.hero,
            couple: state.couple,
            timeline: state.timeline,
            quiz: state.quiz,
            letters: state.letters,
            interactive: state.interactive,
            music: state.music,
        };

        try {
            const res = await fetch('/api/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ slug: targetSlug, data: exportData })
            });

            if (res.ok) {
                await res.json();
                addToast("Journey saved successfully!", 'success');
            } else {
                const err = await res.json();
                const errMsg = err.error || "Unknown error";
                addToast("Failed to save: " + errMsg, 'error');
            }
        } catch (e) {
            console.error(e);
            addToast("Error saving journey.", 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const [journeyUrl, setJourneyUrl] = useState('');
    useEffect(() => {
        setJourneyUrl(`${window.location.origin}/journey/${customSlug || 'your-link-name'}?public=true`);
    }, [customSlug]);

    const copyLink = () => {
        if (!customSlug) {
            addToast("Please save your journey first or enter a custom link name.", 'info');
            return;
        }
        navigator.clipboard.writeText(`${window.location.origin}/journey/${customSlug}?public=true`);
        addToast("Link copied to clipboard!", 'success');
    };

    const handleFileUpload = async (section: string, e: any, onComplete: (val: string) => void) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsLoading(true);
        setLoadingMessage("Uploading image...");

        // Create form data
        const formData = new FormData();
        formData.append('file', file);
        formData.append('section', section);

        // Use custom slug or random one for bucket association
        const slug = customSlug.trim() || 'draft';
        formData.append('slug', slug);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) throw new Error("Upload failed");

            const data = await res.json();
            onComplete(data.url);
            addToast("Image uploaded successfully!", 'success');
        } catch (error) {
            console.error("Error uploading", error);
            addToast("Failed to upload image. Please try again.", 'error');
        } finally {
            setIsLoading(false);
            // Clear input so same file can be selected again if needed
            e.target.value = '';
        }
    };

    if (isPublic) return null;

    return (
        <>
            <Loading isLoading={isLoading} message={loadingMessage} />
            <ToastContainer toasts={toasts} removeToast={removeToast} />

            <button className={styles.fab} onClick={toggleEditor} title="Customize Content">
                <Wand2 size={24} />
            </button>

            <div className={`${styles.drawer} ${isEditorOpen ? styles.open : ''} `}>
                <div className={styles.drawerHeader}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Wand2 size={20} /> Design Your Love
                    </h3>
                    <button onClick={toggleEditor} className={styles.closeBtn}>
                        <X size={24} />
                    </button>
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
                                            className={`${styles.controlBtn} ${styles.danger} `}
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
                                                onChange={(e) => handleFileUpload('timeline', e, (val) => {
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
                                        className={`${styles.controlBtn} ${styles.danger} `}
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
                                                name={`q - ${i} -ans`}
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
                                                placeholder={`Option ${optIdx + 1} `}
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
                                            onChange={(e) => handleFileUpload('quiz', e, (val) => {
                                                const newQs = [...quiz.questions];
                                                newQs[i].image = val;
                                                updateSection('quiz', { questions: newQs });
                                            })}
                                        />
                                    </label>
                                    {q.image && <span style={{ fontSize: '0.8rem', color: 'var(--hot-pink)', display: 'flex', alignItems: 'center', gap: '4px' }}>Image Set <Check size={14} /></span>}
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

                    <AccordionItem title="Love Notes">
                        <div className={styles.floatingInput}>
                            <input
                                placeholder=" "
                                value={letters.title}
                                onChange={(e) => updateSection('letters', { title: e.target.value })}
                            />
                            <label>Section Title</label>
                        </div>

                        <AnimatePresence mode='popLayout'>
                            {letters.items.map((letter: any, i: number) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.2 }}
                                    key={letter.id}
                                    className={styles.cardEdit}
                                >
                                    <div className={styles.controlRow}>
                                        <span className={styles.cardIndex}>#{i + 1}</span>
                                        <div style={{ flex: 1 }}></div>
                                        <button
                                            className={styles.controlBtn}
                                            onClick={() => {
                                                if (i === 0) return;
                                                const newItems = [...letters.items];
                                                [newItems[i - 1], newItems[i]] = [newItems[i], newItems[i - 1]];
                                                updateSection('letters', { items: newItems });
                                            }}
                                            disabled={i === 0}
                                            title="Move Up"
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
                                        </button>
                                        <button
                                            className={styles.controlBtn}
                                            onClick={() => {
                                                if (i === letters.items.length - 1) return;
                                                const newItems = [...letters.items];
                                                [newItems[i + 1], newItems[i]] = [newItems[i], newItems[i + 1]];
                                                updateSection('letters', { items: newItems });
                                            }}
                                            disabled={i === letters.items.length - 1}
                                            title="Move Down"
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M19 12l-7 7-7-7" /></svg>
                                        </button>
                                        <button
                                            className={`${styles.controlBtn} ${styles.danger}`}
                                            onClick={() => {
                                                if (confirm("Delete this love note?")) {
                                                    const newItems = letters.items.filter((_: any, idx: number) => idx !== i);
                                                    updateSection('letters', { items: newItems });
                                                }
                                            }}
                                            title="Delete Note"
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" /></svg>
                                        </button>
                                    </div>

                                    <input
                                        className={styles.cleanInput}
                                        value={letter.title}
                                        placeholder="Note Title (e.g. Open When You're Happy)"
                                        onChange={(e) => {
                                            const newItems = [...letters.items];
                                            newItems[i] = { ...newItems[i], title: e.target.value };
                                            updateSection('letters', { items: newItems });
                                        }}
                                    />

                                    <textarea
                                        className={styles.cleanInput}
                                        value={letter.content}
                                        placeholder="Write your heartfelt message..."
                                        rows={3}
                                        style={{ marginTop: '0.5rem', resize: 'vertical', minHeight: '80px' }}
                                        onChange={(e) => {
                                            const newItems = [...letters.items];
                                            newItems[i] = { ...newItems[i], content: e.target.value };
                                            updateSection('letters', { items: newItems });
                                        }}
                                    />

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
                                        <label style={{ fontSize: '0.85rem', color: '#666' }}>Envelope Color</label>
                                        <input
                                            type="color"
                                            value={letter.color}
                                            onChange={(e) => {
                                                const newItems = [...letters.items];
                                                newItems[i] = { ...newItems[i], color: e.target.value };
                                                updateSection('letters', { items: newItems });
                                            }}
                                            style={{ width: '36px', height: '36px', border: 'none', borderRadius: '8px', cursor: 'pointer', padding: 0 }}
                                        />
                                        <span style={{ fontSize: '0.8rem', color: '#999' }}>{letter.color}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        <button
                            className={styles.addBtn}
                            onClick={() => {
                                const maxId = letters.items.reduce((max: number, item: any) => Math.max(max, item.id), 0);
                                const newItems = [...letters.items, {
                                    id: maxId + 1,
                                    title: "Open When...",
                                    content: "",
                                    color: "#ffe4e1"
                                }];
                                updateSection('letters', { items: newItems });
                            }}
                        >
                            + Add Love Note
                        </button>
                    </AccordionItem>

                    <AccordionItem title="Background Music">
                        <div className={styles.floatingInput}>
                            <input
                                placeholder=" "
                                value={musicUrl}
                                onChange={(e) => updateSection('music', { url: e.target.value })}
                            />
                            <label>YouTube Link</label>
                        </div>
                    </AccordionItem>

                    <AccordionItem title="Sharing & Publishing">
                        <div className={styles.floatingInput}>
                            <input
                                placeholder=" "
                                value={customSlug}
                                onChange={(e) => setCustomSlug(e.target.value)}
                            />
                            <label>Custom Link Name (e.g., jack-loves-rose)</label>
                        </div>

                        <div style={{ marginTop: '1rem', padding: '1rem', background: '#f0f0f0', borderRadius: '8px' }}>
                            <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>Your Public Link:</p>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input
                                    readOnly
                                    value={journeyUrl}
                                    style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc', background: '#fff' }}
                                />
                                <button onClick={copyLink} title="Copy Link" style={{ padding: '8px', cursor: 'pointer', background: '#fff', border: '1px solid #ccc', borderRadius: '4px' }}>
                                    <Copy size={18} />
                                </button>
                                <a href={journeyUrl} target="_blank" rel="noopener noreferrer" title="Open in New Tab" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px', background: '#fff', border: '1px solid #ccc', borderRadius: '4px', color: 'inherit' }}>
                                    <ExternalLink size={18} />
                                </a>
                            </div>
                        </div>
                    </AccordionItem>

                </div>

                <div className={styles.footerAction}>
                    <button className={styles.shareBtn} onClick={handleSave}>
                        <Save size={18} /> Save Changes
                    </button>
                    <p className={styles.shareHint}>Opens your personalized love page in a new tab.</p>
                </div>
            </div>
        </>
    );
}
