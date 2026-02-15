import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { listJourneys } from "@/lib/journeyService";
import JourneyList from "@/components/JourneyList"; // Extract to client component
import { Heart } from "lucide-react";

export default async function DashboardPage() {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId) {
        redirect("/");
    }

    // Serializable data
    const journeys = JSON.parse(JSON.stringify(await listJourneys(userId)));

    return (
        <div style={{ padding: '4rem 2rem', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        Welcome, {user?.firstName || "Lover"}! <Heart fill="#ff4d4d" stroke="#ff4d4d" />
                    </h1>
                    <p style={{ color: '#666' }}>Manage your love stories.</p>
                </div>
                <Link href="/new-journey">
                    <button style={{
                        padding: '12px 24px',
                        background: '#ff4d4d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50px',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        boxShadow: '0 4px 15px rgba(255, 77, 77, 0.3)'
                    }}>
                        + New Journey
                    </button>
                </Link>
            </div>

            <JourneyList initialJourneys={journeys} />
        </div>
    );
}
