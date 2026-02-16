import { NextRequest, NextResponse } from 'next/server';
import { s3Client } from '@/lib/s3';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { auth } from '@clerk/nextjs/server';

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || 'be-my-love-assets';

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { url } = await req.json();
        if (!url) {
            return NextResponse.json({ error: "No URL provided" }, { status: 400 });
        }

        // Extract Key from URL
        // URL format: https://endpoint/bucket/key
        // or https://bucket.endpoint/key
        // Assuming path-style as per upload route: endpoint/bucket/key

        let key = '';
        try {
            const urlObj = new URL(url);
            const pathParts = urlObj.pathname.split('/');
            // pathParts[0] is empty, [1] is bucket, [2+] is key
            if (pathParts[1] === BUCKET_NAME) {
                key = pathParts.slice(2).join('/');
            } else {
                // Try assuming the path IS the key if bucket not in path (virtual host style)
                key = urlObj.pathname.substring(1);
            }
        } catch (e) {
            return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
        }

        // Security Check: Key must start with userId
        if (!key.startsWith(`${userId}/`)) {
            return NextResponse.json({ error: "Unauthorized: Cannot delete files not owned by you" }, { status: 403 });
        }

        console.log("[Delete] 🗑️ Deleting key:", key);

        await s3Client.send(new DeleteObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
        }));

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error("Delete error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
