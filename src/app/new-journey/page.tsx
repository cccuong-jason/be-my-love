"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useContentStore, defaultContent } from '@/store/contentStore';
import { Heart } from 'lucide-react';

export default function NewJourneyPage() {
    const [title, setTitle] = useState("");
    const [yourName, setYourName] = useState("");
    const [partnerName, setPartnerName] = useState("");
    const [slug, setSlug] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        // Basic validation
        const safeSlug = slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
        if (!safeSlug) {
            setError("Please enter a valid URL name.");
            setIsSubmitting(false);
            return;
        }

        try {
            // Prepare initial data
            const initialData = {
                ...defaultContent,
                hero: {
                    ...defaultContent.hero,
                    title: title || defaultContent.hero.title,
                },
                couple: {
                    yourName: yourName || defaultContent.couple.yourName,
                    partnerName: partnerName || defaultContent.couple.partnerName,
                }
            };

            const res = await fetch('/api/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ slug: safeSlug, data: initialData })
            });

            if (res.ok) {
                const json = await res.json();
                // Redirect to the new journey
                router.push(`/journey/${json.slug}`);
            } else {
                const err = await res.json();
                setError(err.error || "Failed to create journey");
            }

        } catch (e) {
            console.error(e);
            setError("An unexpected error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #fff0f3 0%, #ffe3e3 100%)',
            fontFamily: 'var(--font-open-sans)'
        }}>
            <div style={{
                background: 'white',
                padding: '3rem',
                borderRadius: '20px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                width: '100%',
                maxWidth: '500px'
            }}>
                <h1 style={{
                    fontFamily: 'var(--font-great-vibes)',
                    fontSize: '3rem',
                    color: '#ff4d4d',
                    textAlign: 'center',
                    marginBottom: '2rem'
                }}>Start a New Story</h1>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#555' }}>
                            Journey Title
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Our Love Story, Happy Anniversary"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid #ddd',
                                fontSize: '1rem'
                            }}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#555' }}>
                                Your Name
                            </label>
                            <input
                                type="text"
                                placeholder="Me"
                                value={yourName}
                                onChange={(e) => setYourName(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid #ddd',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#555' }}>
                                Partner's Name
                            </label>
                            <input
                                type="text"
                                placeholder="Them"
                                value={partnerName}
                                onChange={(e) => setPartnerName(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid #ddd',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#555' }}>
                            URL Name (Slug)
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. jenny-and-mark"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid #ddd',
                                fontSize: '1rem'
                            }}
                        />
                        <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.3rem' }}>
                            Your link will be: bemylove.app/journey/{slug || '...'}
                        </p>
                    </div>

                    {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        style={{
                            background: '#ff4d4d',
                            color: 'white',
                            padding: '14px',
                            borderRadius: '50px',
                            border: 'none',
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            marginTop: '1rem',
                            opacity: isSubmitting ? 0.7 : 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px'
                        }}
                    >
                        {isSubmitting ? 'Creating...' : <>Create Journey <Heart fill="white" size={20} /></>}
                    </button>

                    <button
                        type="button"
                        onClick={() => router.push('/dashboard')}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#888',
                            cursor: 'pointer',
                            textDecoration: 'underline'
                        }}
                    >
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
}
