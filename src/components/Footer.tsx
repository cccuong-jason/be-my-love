"use client";
import { useContentStore } from '@/store/contentStore';
import EditableText from './Editor/EditableText';
import styles from './Footer.module.css';

import { Heart } from 'lucide-react';

export default function Footer() {
    const couple = useContentStore((state) => state.couple);

    return (
        <footer className={styles.footer}>
            <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                Made with <Heart size={16} fill="red" stroke="red" /> from <EditableText section="couple" field="yourName" value={couple.yourName} />
            </p>
            <p>© {new Date().getFullYear()} Be My Love</p>
        </footer>
    );
}
