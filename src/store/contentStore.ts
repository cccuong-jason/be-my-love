"use client";
import { create } from 'zustand';

export interface ContentState {
    hero: {
        titles: string[];
        subtitle: string;
    };
    couple: {
        yourName: string;
        partnerName: string;
    };
    timeline: {
        title: string;
        events: { id: string; date: string; title: string; description: string; image?: string }[];
    };
    quiz: {
        title: string;
        questions: {
            question: string;
            options: string[];
            answer: number;
            image?: string;
            celebration?: string;
        }[];
        celebrationText: string; // fallback
    };
    letters: {
        title: string;
        items: {
            id: number;
            title: string;
            content: string;
            color: string;
            isLocked?: boolean;
            lockQuestion?: string;
            lockOptions?: string[];
            lockAnswer?: number;
            isUnlocked?: boolean; // Client-side state
            contextImage?: string; // Image shown after unlocking
        }[];
    };
    gallery: {
        title: string;
        images: {
            id: string;
            src: string;
            caption: string;
            description?: string; // New field
            rotation: number
        }[];
    };
    interactive: {
        question: string;
        yesText: string;
        noTexts: string[];
        successTitle: string;
        successText: string;
    };
    music: {
        url: string;
    };
    slug?: string;
    isEditorOpen: boolean;
    toggleEditor: () => void;
    updateSection: (section: keyof Omit<ContentState, 'isEditorOpen' | 'toggleEditor' | 'updateSection' | 'setFullState' | 'slug'>, data: any) => void;
    setFullState: (state: any) => void;
}

export const defaultContent = {
    hero: {
        titles: ["To My Valentine", "My Love", "My Everything"],
        subtitle: "A journey of love...",
    },
    couple: {
        yourName: "Your Name",
        partnerName: "Partner Name",
    },
    timeline: {
        title: "Our Journey",
        events: [
            { id: "1", date: "2023-10-15", title: "First Met", description: "The moment time stood still.", image: "https://picsum.photos/id/10/400/600" },
            { id: "2", date: "2023-11-20", title: "First Date", description: "Coffee, laughter, and a spark.", image: "https://picsum.photos/id/11/400/600" },
            { id: "3", date: "2024-02-14", title: "First Valentine", description: "Adventures together begin.", image: "https://picsum.photos/id/12/400/600" },
            { id: "4", date: "2024-05-01", title: "Forever", description: "Writing our story, day by day.", image: "" },
        ],
    },
    quiz: {
        title: "How Well Do You Know Us?",
        questions: [
            {
                question: "Where was our first date?",
                options: ["Coffee Shop", "Park", "Cinema", "Moon"],
                answer: 0,
                image: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=500&q=60",
                celebration: "That latte art was almost as cute as you! ☕"
            },
            {
                question: "Who said 'I love you' first?",
                options: ["Me", "You", "Both at once", "My Cat"],
                answer: 0,
                image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=500&q=60",
                celebration: "I couldn't help it! You're too lovable! 🥰"
            },
            {
                question: "What is my favorite food?",
                options: ["Pizza", "Sushi", "Tacos", "Love"],
                answer: 1,
                image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=60",
                celebration: "Sushi dates are the best dates! 🍣"
            },
        ],
        celebrationText: "Correct! We are a perfect match! ❤"
    },
    letters: {
        title: "Love Notes",
        items: [
            {
                id: 1,
                title: "Open When You're Happy",
                content: "Remember this moment and smile! You deserve all the joy in the world.",
                color: "#ffe0e6",
                isLocked: false,
                contextImage: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=500&q=60" // Example context image
            },
            {
                id: 2,
                title: "Open When You Miss Me",
                content: "I'm always with you in spirit. Close your eyes and feel my hug.",
                color: "#fff0f5",
                isLocked: true,
                lockQuestion: "Where did we have our first kiss?",
                lockOptions: ["Park", "Car", "Doorstep", "Beach"],
                lockAnswer: 2,
                contextImage: ""
            },
            {
                id: 3,
                title: "Open When You Need a Hug",
                content: "Sending you the biggest, warmest virtual hug right now! (and a real one soon)",
                color: "#f0fff0",
                isLocked: false
            },
        ],
    },
    gallery: {
        title: "Moments",
        images: [
            { id: "1", src: "https://picsum.photos/id/10/400/600", caption: "Nature Memory", description: "A beautiful day in the woods.", rotation: -2 },
            { id: "2", src: "https://picsum.photos/id/11/400/600", caption: "Walk in Park", description: "Walking hand in hand.", rotation: 3 },
            { id: "3", src: "https://picsum.photos/id/12/400/600", caption: "Beach Day", description: "Sun, sand, and you.", rotation: -5 },
        ]
    },
    interactive: {
        question: "Will you be my Valentine?",
        yesText: "Yes!",
        noTexts: ["No", "Are you sure?", "Really?", "Don't break my heart!", "Last chance!"],
        successTitle: "Yay! I knew you'd say yes! ❤",
        successText: "Let's make this the best Valentine's ever.",
    },
    music: {
        url: "https://www.youtube.com/watch?v=5qap5aO4i9A", // Lofi Hip Hop / Relaxing
    },
};

export const useContentStore = create<ContentState>((set) => ({
    ...defaultContent,
    isEditorOpen: false,
    toggleEditor: () => set((state) => ({ isEditorOpen: !state.isEditorOpen })),
    updateSection: (section, data) => set((state) => ({ [section]: { ...state[section], ...data } })),
    setFullState: (newState) => set((state) => ({ ...state, ...newState })),
}));
