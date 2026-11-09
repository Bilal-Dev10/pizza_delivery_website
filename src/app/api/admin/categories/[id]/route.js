
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Category from "@/models/Category";
import Product from "@/models/Product";
import { authorizeAdmin } from "@/middlewares/authorizeAdmin";

export async function PATCH(request, { params }) {
    try {
        const admin = await authorizeAdmin();

        if (!admin) {
            return NextResponse.json(
                { message: "Admin access denied" },
                { status: 403 }
            );
        }

        await connectDB();

        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { message: "Invalid category ID" },
                { status: 400 }
            );
        }

        const { name, description, image, isActive } = await request.json();
        const category = await Category.findById(id);

        if (!category) {
            return NextResponse.json(
                { message: "Category not found" },
                { status: 404 }
            );
        }

        if (name !== undefined) {
            if (!name.trim()) {
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

            const duplicate = await Category.findOne({
                _id: { $ne: id },
                $or: [
                    { name: { $regex: `^${cleanName}$`, $options: "i" } },
                    { slug },
                ],
            });

            if (duplicate) {
                return NextResponse.json(
                    { message: "Another category already uses this name" },
                    { status: 409 }
                );
            }

            category.name = cleanName;
            category.slug = slug;
        }

        if (description !== undefined) {
            category.description = description;
        }

        if (image !== undefined) {
            category.image = image;
        }

        if (isActive !== undefined) {
            category.isActive = isActive;
        }

        await category.save();

        return NextResponse.json({
            message: "Category updated successfully",
            category,
        });
    } catch (error) {
        console.error("Update category error:", error);
        return NextResponse.json(
            { message: "Failed to update category" },
            { status: 500 }
        );
    }
}

export async function DELETE(request, { params }) {
    try {
        const admin = await authorizeAdmin();

        if (!admin) {
            return NextResponse.json(
                { message: "Admin access denied" },
                { status: 403 }
            );
        }

        await connectDB();

        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { message: "Invalid category ID" },
                { status: 400 }
            );
        }

        const category = await Category.findById(id);

        if (!category) {
            return NextResponse.json(
                { message: "Category not found" },
                { status: 404 }
            );
        }

        const productsExist = await Product.exists({ category: id });

        if (productsExist) {
            return NextResponse.json(
                {
                    message: "This category has products. Move or remove those products before deleting it.",
                },
                { status: 409 }
            );
        }

        await Category.findByIdAndDelete(id);

        return NextResponse.json({
            message: "Category deleted successfully",
        });
    } catch (error) {
        console.error("Delete category error:", error);
        return NextResponse.json(
            { message: "Failed to delete category" },
            { status: 500 }
        );
    }
}
