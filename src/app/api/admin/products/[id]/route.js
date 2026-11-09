
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";
import cloudinary from "@/lib/cloudinary";
import { authorizeAdmin } from "@/middlewares/authorizeAdmin";

function createSlug(value) {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
}

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
                { message: "Invalid product ID" },
                { status: 400 }
            );
        }

        const product = await Product.findById(id);

        if (!product) {
            return NextResponse.json(
                { message: "Product not found" },
                { status: 404 }
            );
        }

        const body = await request.json();

        if (body.name !== undefined) {
            if (!body.name.trim()) {
                return NextResponse.json(
                    { message: "Product name is required" },
                    { status: 400 }
                );
            }

            const slug = createSlug(body.name);

            const duplicate = await Product.findOne({
                _id: { $ne: id },
                slug,
            });

            if (duplicate) {
                return NextResponse.json(
                    { message: "Another product already uses this name" },
                    { status: 409 }
                );
            }

            product.name = body.name.trim();
            product.slug = slug;
        }

        if (body.description !== undefined) {
            if (!body.description.trim()) {
                return NextResponse.json(
                    { message: "Description is required" },
                    { status: 400 }
                );
            }
            product.description = body.description.trim();
        }

        if (body.price !== undefined) {
            const price = Number(body.price);

            if (!Number.isFinite(price) || price < 0) {
                return NextResponse.json(
                    { message: "Invalid product price" },
                    { status: 400 }
                );
            }

            product.price = price;
        }

        if (body.category !== undefined) {
            const category = await Category.findOne({
                _id: body.category,
                isActive: true,
            });

            if (!category) {
                return NextResponse.json(
                    { message: "Please select an active category" },
                    { status: 400 }
                );
            }

            product.category = category._id;
        }

        if (body.images !== undefined) {
            if (
                !Array.isArray(body.images) ||
                body.images.length === 0 ||
                !body.images.every((image) => image.url && image.public_id)
            ) {
                return NextResponse.json(
                    { message: "At least one valid product image is required" },
                    { status: 400 }
                );
            }

            product.images = body.images;
        }

        if (body.sizes !== undefined) {
            if (
                !Array.isArray(body.sizes) ||
                body.sizes.length === 0 ||
                !body.sizes.every(
                    (size) =>
                        size.name?.trim() &&
                        Number.isFinite(Number(size.price)) &&
                        Number(size.price) >= 0
                )
            ) {
                return NextResponse.json(
                    { message: "Please enter valid pizza sizes and prices" },
                    { status: 400 }
                );
            }

            product.sizes = body.sizes.map((size) => ({
                name: size.name.trim(),
                price: Number(size.price),
            }));
        }

        if (body.toppings !== undefined) {
            if (!Array.isArray(body.toppings)) {
                return NextResponse.json(
                    { message: "Invalid toppings" },
                    { status: 400 }
                );
            }

            product.toppings = body.toppings
                .filter((item) => item.name?.trim())
                .map((item) => ({
                    name: item.name.trim(),
                    price: Number(item.price) || 0,
                }));
        }

        if (body.isFeatured !== undefined) {
            product.isFeatured = Boolean(body.isFeatured);
        }

        if (body.isAvailable !== undefined) {
            product.isAvailable = Boolean(body.isAvailable);
        }

        await product.save();

        return NextResponse.json({
            message: "Product updated successfully",
            product,
        });
    } catch (error) {
        console.error("Update product error:", error);

        return NextResponse.json(
            { message: "Failed to update product" },
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
                { message: "Invalid product ID" },
                { status: 400 }
            );
        }

        const product = await Product.findById(id);

        if (!product) {
            return NextResponse.json(
                { message: "Product not found" },
                { status: 404 }
            );
        }

        await Product.findByIdAndDelete(id);

        await Promise.allSettled(
            product.images.map((image) =>
                image.public_id
                    ? cloudinary.uploader.destroy(image.public_id)
                    : Promise.resolve()
            )
        );

        return NextResponse.json({
            message: "Product deleted successfully",
        });
    } catch (error) {
        console.error("Delete product error:", error);

        return NextResponse.json(
            { message: "Failed to delete product" },
            { status: 500 }
        );
    }
}
