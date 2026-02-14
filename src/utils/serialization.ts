import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from "lz-string";
import { ContentState, defaultContent } from "@/store/contentStore";

export const serializeContent = (state: ContentState) => {
    const { hero, couple, timeline, quiz, letters, interactive, music } = state;
    const data = { hero, couple, timeline, quiz, letters, interactive, music };
    const json = JSON.stringify(data);
    return compressToEncodedURIComponent(json);
};

export const deserializeContent = (hash: string) => {
    try {
        const json = decompressFromEncodedURIComponent(hash);
        if (!json) return null;
        const data = JSON.parse(json);

        // Merge with default content to ensure all fields exist (migration safety)
        return {
            ...defaultContent,
            ...data,
            // Deep merge might be better but simple spread works for top-level sections
            // We need to ensure new sections like 'quiz' exist if loading old URL
            quiz: data.quiz || defaultContent.quiz,
            music: data.music || defaultContent.music,
            couple: data.couple || defaultContent.couple,
            // If timeline is old (no images), it might just have title/desc.
            // But types are robust enough.
        };
    } catch (e) {
        console.error("Failed to parse URL state", e);
        return null;
    }
};

export const updateUrl = (state: ContentState) => {
    const hash = serializeContent(state);
    window.location.hash = hash;
};
