import { S3Client } from "@aws-sdk/client-s3";

const S3_ACCESS_KEY = process.env.AWS_S3_ACCESS_KEY;
const S3_SECRET_KEY = process.env.AWS_S3_SECRET_KEY;
const S3_REGION = process.env.AWS_S3_REGION || "us-east-1";
const S3_ENDPOINT = process.env.AWS_S3_ENDPOINT || "https://s3.cloudfly.vn";

// Comprehensive env logging for debugging
console.log("[S3] 🔧 Configuration:", {
    hasAccessKey: !!S3_ACCESS_KEY,
    accessKeyPrefix: S3_ACCESS_KEY ? S3_ACCESS_KEY.substring(0, 4) + "..." : "MISSING",
    hasSecretKey: !!S3_SECRET_KEY,
    region: S3_REGION,
    endpoint: S3_ENDPOINT,
    bucketName: process.env.AWS_S3_BUCKET_NAME || "be-my-love-assets (default)",
});

if (!S3_ACCESS_KEY || !S3_SECRET_KEY) {
    console.error("[S3] ❌ Missing AWS S3 Credentials! Check environment variables.");
}

export const s3Client = new S3Client({
    region: S3_REGION,
    endpoint: S3_ENDPOINT,
    credentials: {
        accessKeyId: S3_ACCESS_KEY || "",
        secretAccessKey: S3_SECRET_KEY || "",
    },
    forcePathStyle: true,
});
