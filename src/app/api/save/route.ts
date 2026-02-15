import { NextRequest, NextResponse } from 'next/server';
import { saveJourney } from '@/lib/journeyService';
import { auth } from '@clerk/nextjs/server';

export async function POST(req: NextRequest) {
    console.log("[Save] -> POST /api/save - Request received");
    try {
        console.log("[Save] Checking auth...");
        const { userId } = await auth();
        console.log("[Save] Auth result:", { userId: userId ? userId.substring(0, 8) + "..." : null });

        if (!userId) {
            console.log("[Save] ❌ Unauthorized");
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        console.log("[Save] Parsing JSON...");
        const jsonData = await req.json();
        const { slug, data } = jsonData;
        console.log("[Save] Data parsed:", { slug, dataKeys: data ? Object.keys(data) : null });

        if (!slug || !data) {
            console.log("[Save] ❌ Missing slug or data");
            return NextResponse.json({ error: "Missing slug or data" }, { status: 400 });
        }

        console.log("[Save] Calling saveJourney...");
        const safeSlug = await saveJourney(userId, slug, data);
        console.log("[Save] ✅ Success:", safeSlug);

        return NextResponse.json({ success: true, slug: safeSlug });

    } catch (error: any) {
        console.error("[Save] ❌ Error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
