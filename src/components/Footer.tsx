"use client";
import { useContentStore } from '@/store/contentStore';
import EditableText from './Editor/EditableText';
import styles from './Footer.module.css';

export default function Footer() {
    const couple = useContentStore((state) => state.couple);

    return (
        <footer className={styles.footer}>
            <p>
                Made with ❤ from <EditableText section="couple" field="yourName" value={couple.yourName} />
            </p>
            <p>© {new Date().getFullYear()} Be My Love</p>
        </footer>
    );
}
