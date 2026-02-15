"use client";
import { useEffect } from 'react';
import { useContentStore } from '@/store/contentStore';

export default function StoreHydrator({ data, slug }: { data: any, slug?: string }) {
    const setFullState = useContentStore((state) => state.setFullState);

    useEffect(() => {
        if (data) {
            setFullState({ ...data, slug });
        }
    }, [data, slug, setFullState]);

    return null;
}
