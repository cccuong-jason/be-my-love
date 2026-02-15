"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, Edit2, Trash2, Heart } from 'lucide-react';

export default function JourneyList({ initialJourneys }: { initialJourneys: any[] }) {
    const [journeys, setJourneys] = useState(initialJourneys);
    const router = useRouter();

    const handleDelete = async (slug: string) => {
        if (!confirm("Are you sure you want to delete this journey? This cannot be undone.")) return;

        try {
            const res = await fetch(`/api/journeys/delete?slug=${slug}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setJourneys(prev => prev.filter(j => j.slug !== slug));
                router.refresh(); // Refresh server stats if any
            } else {
                alert("Failed to delete journey.");
            }
        } catch (e) {
            console.error(e);
            alert("Error deleting journey.");
        }
    };

    if (journeys.length === 0) {
        return (
            <div style={{
                textAlign: 'center',
                padding: '4rem',
                background: '#fff0f3',
                borderRadius: '20px',
                border: '2px dashed #ffccd5'
            }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    No journeys yet <Heart size={24} className="text-gray-400" />
                </h2>
                <p style={{ marginBottom: '2rem' }}>Start your first digital love story today!</p>
            </div>
        );
    }

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
            {journeys.map((j: any) => (
                <div key={j.slug} style={{
                    background: 'white',
                    padding: '1.5rem',
                    borderRadius: '15px',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                    border: '1px solid #eee',
                    position: 'relative'
                }}>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', textTransform: 'capitalize' }}>
                        {j.data?.hero?.title || j.slug}
                    </h3>
                    <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                        /{j.slug}
                    </p>
                    <div style={{ display: 'flex', gap: '15px', marginTop: 'auto' }}>
                        <Link href={`/journey/${j.slug}?public=true`} target="_blank" style={{
                            textDecoration: 'none',
                            color: '#666',
                            fontWeight: 'bold',
                            fontSize: '0.9rem',
                            display: 'flex', alignItems: 'center', gap: '5px',
                            padding: '5px 10px', background: '#f5f5f5', borderRadius: '5px'
                        }}>
                            <Eye size={16} /> View
                        </Link>
                        <Link href={`/journey/${j.slug}`} style={{
                            textDecoration: 'none',
                            color: '#ff4d4d',
                            fontWeight: 'bold',
                            fontSize: '0.9rem',
                            display: 'flex', alignItems: 'center', gap: '5px',
                            padding: '5px 10px', background: '#fff0f3', borderRadius: '5px'
                        }}>
                            <Edit2 size={16} /> Edit
                        </Link>
                    </div>

                    <button
                        onClick={() => handleDelete(j.slug)}
                        style={{
                            position: 'absolute',
                            top: '1rem',
                            right: '1rem',
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            opacity: 0.5,
                            color: '#999'
                        }}
                        title="Delete Journey"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            ))}
        </div>
    );
}
