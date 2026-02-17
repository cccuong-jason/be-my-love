"use client";
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, Loader2, X } from 'lucide-react';
// import { UploadCloud, Loader2, X } from './Icons'; // Assuming icons are available

// Note: Ensure react-dropzone and lucide-react are installed.
// If not using lucide-react, replace icons with SVGs.

interface FileUploaderProps {
    onUpload: (url: string) => void;
    currentValue?: string;
    accept?: Record<string, string[]>;
    maxSize?: number; // in bytes
    label?: string;
    folderPath?: string; // e.g., "couple", "gallery"
}

export default function FileUploader({
    onUpload,
    currentValue,
    accept = {
        'image/*': ['.png', '.gif', '.jpeg', '.jpg', '.webp']
    },
    maxSize = 5 * 1024 * 1024, // 5MB
    label,
    folderPath = "uploads"
}: FileUploaderProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;

        setIsUploading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('folder', folderPath);

            // Simulating API call for now. In real app, call your API endpoint.
            // const response = await fetch('/api/upload', { method: 'POST', body: formData });
            // if (!response.ok) throw new Error('Upload failed');
            // const data = await response.json();
            // onUpload(data.url);

            // Placeholder for now as we don't have the API endpoint ready in this diff
            console.log("Uploading file:", file.name, "to folder:", folderPath);
            // Simulate success
            setTimeout(() => {
                onUpload(URL.createObjectURL(file));
                setIsUploading(false);
            }, 1000);

        } catch (err) {
            console.error("Upload error:", err);
            setError("Failed to upload image. Please try again.");
            setIsUploading(false);
        }
    }, [onUpload, folderPath]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept,
        maxSize,
        multiple: false
    });

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        onUpload('');
    };

    return (
        <div style={{ width: '100%' }}>
            {currentValue ? (
                <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-gray-200 group" style={{ minHeight: '150px', background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={currentValue}
                        alt="Uploaded content"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2" style={{ transition: 'opacity 0.2s' }}>
                        <button
                            onClick={handleRemove}
                            className="p-2 bg-white rounded-full text-red-500 hover:bg-red-50 transition-colors"
                            title="Remove image"
                            style={{ padding: '8px', borderRadius: '50%', background: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                            <X size={20} color="#ef4444" />
                        </button>
                        <div
                            {...getRootProps()}
                            className="p-2 bg-white rounded-full text-blue-500 hover:bg-blue-50 transition-colors cursor-pointer"
                            title="Change image"
                            style={{ padding: '8px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                            <input {...getInputProps()} />
                            <UploadCloud size={20} color="#3b82f6" />
                        </div>
                    </div>
                </div>
            ) : (
                <div
                    {...getRootProps()}
                    style={{
                        border: '2px dashed #d1d5db',
                        borderRadius: '0.5rem',
                        padding: '1.5rem',
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'border-color 0.2s',
                        backgroundColor: isDragActive ? '#f0f9ff' : 'transparent',
                        borderColor: isDragActive ? '#3b82f6' : error ? '#fca5a5' : '#d1d5db'
                    }}
                >
                    <input {...getInputProps()} />
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: '#6b7280' }}>
                        {isUploading ? (
                            <Loader2 size={32} className="animate-spin text-primary" color="#3b82f6" />
                        ) : (
                            <UploadCloud size={32} color="#9ca3af" />
                        )}
                        <p style={{ fontSize: '0.875rem', fontWeight: 500, margin: 0 }}>
                            {isUploading ? "Uploading..." : isDragActive ? "Drop it here!" : (label || "Drag & drop or click to upload")}
                        </p>
                        <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: 0 }}>
                            Max size: {Math.round(maxSize / 1024 / 1024)}MB
                        </p>
                    </div>
                </div>
            )}
            {error && <p style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.25rem' }}>{error}</p>}
        </div>
    );
}
