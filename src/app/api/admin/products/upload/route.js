
import { NextResponse } from "next/server";
import { authorizeAdmin } from "@/middlewares/authorizeAdmin";
import cloudinary from "@/lib/cloudinary";

export const runtime = "nodejs";

export async function POST(request) {
    try {
        const admin = await authorizeAdmin();

        if (!admin) {
            return NextResponse.json(
                { message: "Admin access denied" },
                { status: 403 }
            );
        }

        const formData = await request.formData();
        const file = formData.get("image");

        if (!file || typeof file === "string") {
            return NextResponse.json(
                { message: "Please select an image" },
                { status: 400 }
            );
        }

        if (!file.type.startsWith("image/")) {
            return NextResponse.json(
                { message: "Only image files are allowed" },
                { status: 400 }
            );
        }

        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json(
                { message: "Image must be smaller than 5 MB" },
                { status: 400 }
            );
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

        const result = await cloudinary.uploader.upload(base64, {
            folder: "pizza-house/products",
            resource_type: "image",
        });

        return NextResponse.json(
            {
                message: "Image uploaded successfully",
                image: {
                    url: result.secure_url,
                    public_id: result.public_id,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Product image upload error:", error);

        return NextResponse.json(
            { message: "Image upload failed" },
            { status: 500 }
        );
    }
}
