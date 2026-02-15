import { NextRequest, NextResponse } from 'next/server';
import { loadJourney } from '@/lib/journeyService';

export async function GET(req: NextRequest) {
    const slug = req.nextUrl.searchParams.get('slug');

    if (!slug) {
        return NextResponse.json({ error: "Missing slug" }, { status: 400 });
    }

    try {
        const data = await loadJourney(slug);

        if (!data) {
            return NextResponse.json({ error: "Empty data" }, { status: 404 });
        }

        return NextResponse.json(data);

    } catch (error: any) {
        console.error("Load Error:", error);
        if (error.name === 'NoSuchBucket' || error.name === 'NoSuchKey') {
            return NextResponse.json({ error: "Journey not found" }, { status: 404 });
        }
        return NextResponse.json({ error: "Failed to load data" }, { status: 500 });
    }
}
