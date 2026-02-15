import { NextRequest, NextResponse } from 'next/server';
import { saveJourney } from '@/lib/journeyService';
import { auth } from '@clerk/nextjs/server';

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { slug, data } = await req.json();

        if (!slug || !data) {
            return NextResponse.json({ error: "Missing slug or data" }, { status: 400 });
        }

        const safeSlug = await saveJourney(userId, slug, data);
        return NextResponse.json({ success: true, slug: safeSlug });

    } catch (error: any) {
        console.error("Save Error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
