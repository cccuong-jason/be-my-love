import { NextRequest, NextResponse } from 'next/server';
import { s3Client } from '@/lib/s3';
import { PutObjectCommand, CreateBucketCommand, HeadBucketCommand } from '@aws-sdk/client-s3';
import { auth } from '@clerk/nextjs/server';

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || 'be-my-love-assets';

// Log the body size limit config
console.log("[Upload Route] 🔧 Bucket:", BUCKET_NAME);

export async function POST(req: NextRequest) {
    console.log("[Upload] ➡️  POST /api/upload - Request received");
    console.log("[Upload] Headers:", {
        contentType: req.headers.get("content-type")?.substring(0, 80),
        contentLength: req.headers.get("content-length"),
    });

    try {
        // Step 1: Auth
        console.log("[Upload] 🔐 Checking auth...");
        let userId: string | null = null;
        try {
            const authResult = await auth();
            userId = authResult.userId;
            console.log("[Upload] 🔐 Auth result:", { userId: userId ? userId.substring(0, 8) + "..." : null });
        } catch (authError: any) {
            console.error("[Upload] ❌ Auth failed:", authError?.message);
            return NextResponse.json({ error: "Auth Failed", details: authError?.message }, { status: 500 });
        }

        if (!userId) {
            console.log("[Upload] ❌ Unauthorized - no userId");
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Step 2: Parse form data
        console.log("[Upload] 📦 Parsing form data...");
        let formData: FormData;
        try {
            formData = await req.formData();
        } catch (formError: any) {
            console.error("[Upload] ❌ FormData parse failed:", formError?.message);
            return NextResponse.json({ error: "Failed to parse upload", details: formError?.message }, { status: 400 });
        }

        const file = formData.get('file') as File;
        const slug = formData.get('slug') as string || 'unsaved';
        const section = formData.get('section') as string || 'general';

        if (!file) {
            console.log("[Upload] ❌ No file in form data");
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        console.log("[Upload] 📄 File:", {
            name: file.name,
            type: file.type,
            size: file.size,
            slug,
            section,
        });

        // Step 3: Convert to buffer
        console.log("[Upload] 🔄 Converting to buffer...");
        const buffer = Buffer.from(await file.arrayBuffer());
        console.log("[Upload] ✅ Buffer size:", buffer.length, "bytes");

        // Structure: /user-id/journey-id/section/images
        const safeSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-');
        const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
        const key = `${userId}/${safeSlug}/${section}/${filename}`;
        console.log("[Upload] 🔑 S3 Key:", key);

        // Step 4: Ensure bucket exists
        console.log("[Upload] 🪣 Checking bucket:", BUCKET_NAME);
        try {
            await s3Client.send(new HeadBucketCommand({ Bucket: BUCKET_NAME }));
            console.log("[Upload] ✅ Bucket exists");
        } catch (error: any) {
            console.log("[Upload] ⚠️  HeadBucket error:", error?.name, error?.$metadata?.httpStatusCode);
            if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
                console.log("[Upload] 🪣 Creating bucket...");
                try {
                    const createBucketParams: any = { Bucket: BUCKET_NAME };
                    // CloudFly S3 "hn" region doesn't accept LocationConstraint in CreateBucket
                    // if (region && region !== 'us-east-1') {
                    //     createBucketParams.CreateBucketConfiguration = {
                    //         LocationConstraint: region
                    //     };
                    // }
                    console.log("[Upload] createBucketParams:", createBucketParams);
                    await s3Client.send(new CreateBucketCommand(createBucketParams));
                    console.log("[Upload] ✅ Bucket created");
                } catch (e: any) {
                    console.error("[Upload] ❌ Bucket creation failed:", e?.name, e?.message);
                    return NextResponse.json({ error: "Storage Init Failed", details: e?.message }, { status: 500 });
                }
            } else {
                console.error("[Upload] ❌ HeadBucket unexpected error:", error?.name, error?.message);
            }
        }

        // Step 5: Upload to S3
        console.log("[Upload] ⬆️  Uploading to S3...");
        try {
            await s3Client.send(new PutObjectCommand({
                Bucket: BUCKET_NAME,
                Key: key,
                Body: buffer,
                ContentType: file.type,
                ACL: 'public-read', // Ensure public access
            }));
            console.log("[Upload] ✅ S3 upload successful");
        } catch (s3Error: any) {
            console.error("[Upload] ❌ S3 PutObject failed:", {
                name: s3Error?.name,
                message: s3Error?.message,
                statusCode: s3Error?.$metadata?.httpStatusCode,
                requestId: s3Error?.$metadata?.requestId,
            });
            return NextResponse.json({ error: "S3 Upload Failed", details: s3Error?.message }, { status: 500 });
        }

        // Construct the public URL using the S3 endpoint
        // Path-style: https://s3.cloudfly.vn/bucket/key (matches forcePathStyle: true)
        const s3Endpoint = process.env.AWS_S3_ENDPOINT || "https://s3.cloudfly.vn";
        const fileUrl = `${s3Endpoint}/${BUCKET_NAME}/${key}`;
        console.log("[Upload] 🎉 Success! URL:", fileUrl);

        return NextResponse.json({ url: fileUrl });

    } catch (error: any) {
        console.error("[Upload] ❌ Unhandled error:", error?.name, error?.message, error?.stack?.substring(0, 300));
        return NextResponse.json({ error: "Upload Failed", details: error?.message || "Unknown error" }, { status: 500 });
    }
}
