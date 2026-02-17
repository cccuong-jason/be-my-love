import { NextRequest, NextResponse } from 'next/server';
import { s3Client } from '@/lib/s3';
import { ListObjectsV2Command, DeleteObjectsCommand } from '@aws-sdk/client-s3';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/db';
import Journey from '@/models/Journey';

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || 'be-my-love-assets';

// Helper to extract all image URLs from the Journey data
function extractImageUrls(data: any): Set<string> {
    const urls = new Set<string>();

    if (!data) return urls;

    // Timeline images
    if (data.timeline?.events) {
        data.timeline.events.forEach((evt: any) => {
            if (evt.image) urls.add(evt.image);
        });
    }

    // Quiz images
    if (data.quiz?.questions) {
        data.quiz.questions.forEach((q: any) => {
            if (q.image) urls.add(q.image);
        });
    }

    // Letters context images
    if (data.letters?.items) {
        data.letters.items.forEach((item: any) => {
            if (item.contextImage) urls.add(item.contextImage);
        });
    }

    // Gallery images
    if (data.gallery?.images) {
        data.gallery.images.forEach((img: any) => {
            if (img.src) urls.add(img.src);
        });
    }

    return urls;
}

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        // 1. Get the user's current valid journey data
        const journey = await Journey.findOne({ userId });

        let validUrls = new Set<string>();
        if (journey) {
            validUrls = extractImageUrls(journey.data);
        }

        console.log(`[Cleanup] Found ${validUrls.size} valid images in database.`);

        // 2. List all objects in S3 for this user
        // Prefix: userId/
        const prefix = `${userId}/`;
        let continuationToken: string | undefined = undefined;
        const allObjects: any[] = [];

        do {
            const listCmd: ListObjectsV2Command = new ListObjectsV2Command({
                Bucket: BUCKET_NAME,
                Prefix: prefix,
                ContinuationToken: continuationToken
            });
            const s3Res = await s3Client.send(listCmd);
            if (s3Res.Contents) {
                allObjects.push(...s3Res.Contents);
            }
            continuationToken = s3Res.NextContinuationToken;
        } while (continuationToken);

        console.log(`[Cleanup] Found ${allObjects.length} objects in S3 for user.`);

        // 3. Identify orphans
        const objectsToDelete: { Key: string }[] = [];

        for (const obj of allObjects) {
            if (!obj.Key) continue;

            // Construct the full URL for the S3 object to compare with validUrls
            // The validUrls are fully qualified URLs (e.g., https://s3.cloudfly.vn/bucket/key)
            // We need to check if any valid URL contains this Key

            // Optimization: validUrls are full URLs. 
            // Standard approach: Check if `url.includes(obj.Key)` for any url in validUrls.
            // Or extract the key from the validUrl.

            let isUsed = false;
            for (const url of Array.from(validUrls)) {
                if (url.includes(obj.Key)) {
                    isUsed = true;
                    break;
                }
            }

            if (!isUsed) {
                objectsToDelete.push({ Key: obj.Key });
            }
        }

        console.log(`[Cleanup] Identified ${objectsToDelete.length} orphaned objects.`, objectsToDelete);

        // 4. Batch Delete
        if (objectsToDelete.length > 0) {
            // S3 DeleteObjects can handle up to 1000 keys
            const chunkSize = 1000;
            for (let i = 0; i < objectsToDelete.length; i += chunkSize) {
                const chunk = objectsToDelete.slice(i, i + chunkSize);
                await s3Client.send(new DeleteObjectsCommand({
                    Bucket: BUCKET_NAME,
                    Delete: { Objects: chunk }
                }));
            }
        }

        return NextResponse.json({
            success: true,
            deletedCount: objectsToDelete.length,
            message: `Cleaned up ${objectsToDelete.length} unused files.`
        });

    } catch (error: any) {
        console.error("Cleanup error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
