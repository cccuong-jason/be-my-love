import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { pipeline } from "stream";
import { promisify } from "util";

const pump = promisify(pipeline);

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Ensure uploads directory exists
        const uploadsDir = path.join(process.cwd(), "public", "uploads");
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }

        // Generate safe filename
        const timestamp = Date.now();
        const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
        const filename = `${timestamp}-${safeName}`;
        const filePath = path.join(uploadsDir, filename);

        // Write file
        fs.writeFileSync(filePath, buffer);

        // Return public URL
        const fileUrl = `/uploads/${filename}`;

        return NextResponse.json({ url: fileUrl });
    } catch (e) {
        console.error("Upload error:", e);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
