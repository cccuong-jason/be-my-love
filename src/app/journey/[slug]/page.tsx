import Hero from "@/components/Hero";
import Gallery from "@/components/Gallery";
import Journey from "@/components/Journey";
import Letters from "@/components/Letters";
import Interactive from "@/components/Interactive";
import FloatingAssets from "@/components/FloatingAssets";
import MusicPlayer from "@/components/MusicPlayer";
import Footer from "@/components/Footer";
import styles from "../../page.module.css"; // Adjust import path for css
import { loadJourney } from "@/lib/journeyService";
import StoreHydrator from "@/components/StoreHydrator";

// Params type for dynamic route
export default async function JourneyPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    const slug = resolvedParams.slug;

    let initialData = null;

    if (slug) {
        try {
            initialData = await loadJourney(slug);
        } catch (e) {
            console.error("Failed to load journey for hydration:", e);
        }
    }

    return (
        <main className={styles.main}>
            <StoreHydrator data={initialData} slug={slug} />
            <FloatingAssets />
            <MusicPlayer />
            <Hero />
            <Journey />
            <Letters />
            <Gallery />
            <Interactive />
            <Footer />
        </main>
    );
}
