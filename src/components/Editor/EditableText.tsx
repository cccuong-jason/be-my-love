"use client";
import { useState, useEffect } from 'react';
import { useContentStore } from '@/store/contentStore';
import styles from './Editor.module.css';

interface EditableTextProps {
    section: string;
    field: string;
    value: string;
    multiline?: boolean;
    className?: string;
    onUpdate?: (value: string) => void;
}

export default function EditableText({ section, field, value, multiline, className, onUpdate }: EditableTextProps) {
    const isEditorOpen = useContentStore((state) => state.isEditorOpen);
    const updateSection = useContentStore((state) => state.updateSection);
    const [isEditing, setIsEditing] = useState(false);
    const [localValue, setLocalValue] = useState(value);

    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    const handleBlur = () => {
        setIsEditing(false);
        if (onUpdate) {
            onUpdate(localValue);
        } else {
            updateSection(section as any, { [field]: localValue });
        }
    };

    if (isEditorOpen && isEditing) {
        return multiline ? (
            <textarea
                className={`${styles.input} ${className}`}
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                onBlur={handleBlur}
                autoFocus
            />
        ) : (
            <input
                className={`${styles.input} ${className}`}
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                onBlur={handleBlur}
                autoFocus
            />
        );
    }

    return (
        <span
            className={`${className} ${isEditorOpen ? styles.editable : ''}`}
            onClick={() => isEditorOpen && setIsEditing(true)}
            title={isEditorOpen ? "Click to edit" : undefined}
        >
            {value}
        </span>
    );
}
