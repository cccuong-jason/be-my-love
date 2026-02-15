import { NextRequest, NextResponse } from 'next/server';
import { s3Client } from '@/lib/s3';
import { PutObjectCommand, CreateBucketCommand, HeadBucketCommand } from '@aws-sdk/client-s3';
import { auth } from '@clerk/nextjs/server';

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || 'be-my-love-assets';

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get('file') as File;
        const slug = formData.get('slug') as string || 'unsaved';
        const section = formData.get('section') as string || 'general';

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        // Structure: /user-id/journey-id/section/images
        const safeSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-');
        const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
        const key = `${userId}/${safeSlug}/${section}/${filename}`;

        // Ensure bucket exists
        try {
            await s3Client.send(new HeadBucketCommand({ Bucket: BUCKET_NAME }));
        } catch (error: any) {
            if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
                try {
                    const region = process.env.AWS_S3_REGION;
                    const createBucketParams: any = { Bucket: BUCKET_NAME };
                    if (region && region !== 'us-east-1') {
                        createBucketParams.CreateBucketConfiguration = {
                            LocationConstraint: region
                        };
                    }
                    await s3Client.send(new CreateBucketCommand(createBucketParams));
                } catch (e) {
                    console.error("Bucket creation failed", e);
                    return NextResponse.json({ error: "Storage Init Failed" }, { status: 500 });
                }
            }
        }

        await s3Client.send(new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
            Body: buffer,
            ContentType: file.type,
        }));

        // The URL for CloudFly bucket
        const fileUrl = `https://${BUCKET_NAME}.s3.cloudfly.vn/${key}`;

        return NextResponse.json({ url: fileUrl });

    } catch (error: any) {
        console.error("Upload Error:", error?.name, error?.message, error?.$metadata);
        return NextResponse.json({ error: "Upload Failed", details: error?.message || "Unknown error" }, { status: 500 });
    }
}
