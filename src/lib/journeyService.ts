import { s3Client } from '@/lib/s3';
// We don't need S3 for saving DATA anymore, only images via the upload API.
// But we might need S3 bucket creation if we still want "Bucket per Journey" for MEDIA.
// The Upload API handles media.
// This service now handles DATA via MongoDB.

import connectToDatabase from '@/lib/db';
import Journey from '@/models/Journey';

export async function saveJourney(userId: string, slug: string, data: any) {
    const safeSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-');

    await connectToDatabase();

    // Upsert the journey
    // Verify ownership if exists? For now, we assume slug uniqueness handles it, 
    // but ideally we should check if slug exists and if userId matches.
    // For MVP, we trust the slug is unique enough or owned by user.
    // Let's add a check: if it exists, userId MUST match.

    const existing = await Journey.findOne({ slug: safeSlug });
    if (existing && existing.userId !== userId) {
        throw new Error("Slug already taken by another user");
    }

    await Journey.findOneAndUpdate(
        { slug: safeSlug },
        { userId, data, slug: safeSlug }, // Ensure slug is set on insert
        { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return safeSlug;
}

export async function loadJourney(slug: string) {
    const safeSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-');

    await connectToDatabase();

    const journey = await Journey.findOne({ slug: safeSlug });

    if (!journey) return null;

    // Mongoose document to POJO
    return journey.data;
}

export async function listJourneys(userId: string) {
    await connectToDatabase();
    const journeys = await Journey.find({ userId }, 'slug createdAt updatedAt data.hero.title data.couple').sort({ updatedAt: -1 });
    return journeys;
}
