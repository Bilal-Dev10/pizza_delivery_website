
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Category from "@/models/Category";
import { authorizeAdmin } from "@/middlewares/authorizeAdmin";

export async function GET() {
    try {
        const admin = await authorizeAdmin();

        if (!admin) {
            return NextResponse.json(
                { message: "Admin access denied" },
                { status: 403 }
            );
        }

        await connectDB();

        const categories = await Category.find().sort({ createdAt: -1 });

        return NextResponse.json({ categories }, { status: 200 });
    } catch (error) {
        console.error("Get categories error:", error);
        return NextResponse.json(
            { message: "Failed to fetch categories" },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const admin = await authorizeAdmin();

        if (!admin) {
            return NextResponse.json(
                { message: "Admin access denied" },
                { status: 403 }
            );
        }

        await connectDB();

        const { name, description, image } = await request.json();

        if (!name || !name.trim()) {
            return NextResponse.json(
                { message: "Category name is required" },
                { status: 400 }
            );
        }

        const cleanName = name.trim();
        const slug = cleanName
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");

        const existingCategory = await Category.findOne({
            $or: [
                { name: { $regex: `^${cleanName}$`, $options: "i" } },
                { slug },
            ],
        });

        if (existingCategory) {
            return NextResponse.json(
                { message: "This category already exists" },
                { status: 409 }
            );
        }

        const category = await Category.create({
            name: cleanName,
            slug,
            description: description || "",
            image: image || "",
        });

        return NextResponse.json(
            { message: "Category created successfully", category },
            { status: 201 }
        );
    } catch (error) {
        console.error("Create category error:", error);
        return NextResponse.json(
            { message: "Failed to create category" },
            { status: 500 }
        );
    }
}
