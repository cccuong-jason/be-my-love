"use client";
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { createPortal } from 'react-dom';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContainerProps {
    toasts: ToastMessage[];
    removeToast: (id: string) => void;
}

const ToastItem = ({ toast, removeToast }: { toast: ToastMessage, removeToast: (id: string) => void }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            removeToast(toast.id);
        }, 4000); // Auto-dismiss after 4 seconds

        return () => clearTimeout(timer);
    }, [toast.id, removeToast]);

    const getIcon = () => {
        switch (toast.type) {
            case 'success': return <CheckCircle size={20} color="#ff4d4d" />; // Love red
            case 'error': return <XCircle size={20} color="#ff4d4d" />;
            default: return <Info size={20} color="#ff4d4d" />;
        }
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                background: 'white',
                color: '#333',
                padding: '12px 20px',
                borderRadius: '50px',
                boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                marginBottom: '10px',
                minWidth: '300px',
                maxWidth: '400px',
                border: '1px solid rgba(255, 77, 77, 0.1)',
                backdropFilter: 'blur(10px)',
            }}
        >
            {getIcon()}
            <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 500, flex: 1 }}>{toast.message}</p>
            <button
                onClick={() => removeToast(toast.id)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', color: '#999' }}
            >
                <X size={16} />
            </button>
        </motion.div>
    );
};

export default function ToastContainer({ toasts, removeToast }: ToastContainerProps) {
    if (typeof window === 'undefined') return null;

    return createPortal(
        <div style={{
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column-reverse', // Newest at bottom
            alignItems: 'center',
            pointerEvents: 'none', // Allow clicking through container
        }}>
            <AnimatePresence>
                {toasts.map((toast) => (
                    <div key={toast.id} style={{ pointerEvents: 'auto' }}>
                        <ToastItem toast={toast} removeToast={removeToast} />
                    </div>
                ))}
            </AnimatePresence>
        </div>,
        document.body
    );
}
