"use client";
import { create } from 'zustand';

export interface ContentState {
    hero: {
        title: string;
        subtitle: string;
    };
    couple: {
        yourName: string;
        partnerName: string;
    };
    timeline: {
        title: string;
        events: { date: string; title: string; description: string; image?: string }[];
    };
    quiz: {
        title: string;
        questions: { question: string; options: string[]; answer: number }[]; // answer is index
    };
    letters: {
        title: string;
        items: { id: number; title: string; content: string; color: string }[];
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
    isEditorOpen: boolean;
    toggleEditor: () => void;
    updateSection: (section: keyof Omit<ContentState, 'isEditorOpen' | 'toggleEditor' | 'updateSection' | 'setFullState'>, data: any) => void;
    setFullState: (state: any) => void;
}

export const defaultContent = {
    hero: {
        title: "To My Valentine",
        subtitle: "A journey of love...",
    },
    couple: {
        yourName: "Your Name",
        partnerName: "Partner Name",
    },
    timeline: {
        title: "Our Journey",
        events: [
            { date: "2023-10-15", title: "First Met", description: "The moment time stood still.", image: "https://picsum.photos/id/10/400/600" },
            { date: "2023-11-20", title: "First Date", description: "Coffee, laughter, and a spark.", image: "https://picsum.photos/id/11/400/600" },
            { date: "2024-02-14", title: "First Valentine", description: "Adventures together begin.", image: "https://picsum.photos/id/12/400/600" },
            { date: "2024-05-01", title: "Forever", description: "Writing our story, day by day.", image: "" },
        ],
    },
    quiz: {
        title: "How Well Do You Know Us?",
        questions: [
            { question: "Where was our first date?", options: ["Coffee Shop", "Park", "Cinema", "Moon"], answer: 0 },
            { question: "Who said 'I love you' first?", options: ["Me", "You", "Both at once", "My Cat"], answer: 0 },
            { question: "What is my favorite food?", options: ["Pizza", "Sushi", "Tacos", "Love"], answer: 1 },
        ],
    },
    letters: {
        title: "Love Notes",
        items: [
            { id: 1, title: "Open When You're Happy", content: "Remember this moment and smile! You deserve all the joy in the world.", color: "#ffe4e1" },
            { id: 2, title: "Open When You Miss Me", content: "Look at the moon, I'm looking at it too. We are under the same sky.", color: "#fff0f5" },
            { id: 3, title: "Open When You Need a Hug", content: "Sending you the biggest, warmest virtual hug right now! (and a real one soon)", color: "#f0fff0" },
        ],
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
