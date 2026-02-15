import { NextResponse } from 'next/server';
import { listJourneys } from '@/lib/journeyService';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const journeys = await listJourneys(userId);
        return NextResponse.json(journeys);

    } catch (error) {
        console.error("List Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
