import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET(request, { params }) {
    try {
        await connectDB();

        const { slug } = await params;

        const product = await Product.findOne({
            slug,
            isAvailable: true,
        })
            .populate({
                path: "category",
                match: { isActive: true },
                select: "name slug",
            })
            .lean();

        if (!product || !product.category) {
            return NextResponse.json(
                { success: false, message: "Pizza not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, product },
            { status: 200 }
        );
    } catch (error) {
        console.error("Single product API error:", error);

        return NextResponse.json(
            { success: false, message: "Failed to fetch pizza" },
            { status: 500 }
        );
    }
}