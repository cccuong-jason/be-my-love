import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Journey from '@/models/Journey';
import { auth } from '@clerk/nextjs/server';

export async function DELETE(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const slug = searchParams.get('slug');

        if (!slug) {
            return NextResponse.json({ error: "Missing slug" }, { status: 400 });
        }

        await connectToDatabase();

        // Find and delete, ensuring ownership
        const result = await Journey.findOneAndDelete({ slug, userId });

        if (!result) {
            return NextResponse.json({ error: "Journey not found or unauthorized" }, { status: 404 });
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Delete Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
