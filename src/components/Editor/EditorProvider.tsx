"use client";
import { useEffect } from 'react';
import { useContentStore } from '@/store/contentStore';
import { deserializeContent, updateUrl } from '@/utils/serialization';
import EditorUI from './EditorUI';

export default function EditorProvider({ children }: { children: React.ReactNode }) {
    const setFullState = useContentStore((state) => state.setFullState);

    // Hydrate from URL
    useEffect(() => {
        const hash = window.location.hash.slice(1); // Remove #
        if (hash) {
            const data = deserializeContent(hash);
            if (data) {
                setFullState(data);
            }
        }
    }, [setFullState]);

    // Update URL on change
    useEffect(() => {
        const unsubscribe = useContentStore.subscribe((state) => {
            updateUrl(state);
        });
        return () => unsubscribe();
    }, []);

    return (
        <>
            {children}
            <EditorUI />
        </>
    );
}
