import { S3Client } from "@aws-sdk/client-s3";

const S3_ACCESS_KEY = process.env.AWS_S3_ACCESS_KEY;
const S3_SECRET_KEY = process.env.AWS_S3_SECRET_KEY;
const S3_REGION = process.env.AWS_S3_REGION || "us-east-1"; // Often dummy for S3-compat
const S3_ENDPOINT = process.env.AWS_S3_ENDPOINT || "https://s3.cloudfly.vn"; // Default to CloudFly

if (!S3_ACCESS_KEY || !S3_SECRET_KEY) {
    console.error("Missing AWS S3 Credentials in .env");
}

export const s3Client = new S3Client({
    region: S3_REGION,
    endpoint: S3_ENDPOINT, // Critical for non-AWS providers
    credentials: {
        accessKeyId: S3_ACCESS_KEY || "",
        secretAccessKey: S3_SECRET_KEY || "",
    },
    forcePathStyle: true, // Recommended for some S3 compatible providers, often doesn't hurt.
});
