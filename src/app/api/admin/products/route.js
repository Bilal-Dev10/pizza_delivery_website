
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { authorizeAdmin } from "@/middlewares/authorizeAdmin";

function createSlug(value) {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
}

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

        const products = await Product.find()
            .populate("category", "name")
            .sort({ createdAt: -1 });

        return NextResponse.json({ products });
    } catch (error) {
        console.error("Get products error:", error);

        return NextResponse.json(
            { message: "Failed to fetch products" },
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

        const {
            name,
            description,
            price,
            images,
            category,
            sizes,
            toppings,
            isFeatured,
        } = await request.json();

        if (!name?.trim() || !description?.trim()) {
            return NextResponse.json(
                { message: "Name and description are required" },
                { status: 400 }
            );
        }

        if (!Number.isFinite(Number(price)) || Number(price) < 0) {
            return NextResponse.json(
                { message: "Enter a valid base price" },
                { status: 400 }
            );
        }

        if (!Array.isArray(images) || images.length === 0) {
            return NextResponse.json(
                { message: "At least one product image is required" },
                { status: 400 }
            );
        }

        if (!Array.isArray(sizes) || sizes.length === 0) {
            return NextResponse.json(
                { message: "Add at least one pizza size and price" },
                { status: 400 }
            );
        }

        const validSizes = sizes.every(
            (size) =>
                size.name?.trim() &&
                Number.isFinite(Number(size.price)) &&
                Number(size.price) >= 0
        );

        if (!validSizes) {
            return NextResponse.json(
                { message: "Please enter valid size names and prices" },
                { status: 400 }
            );
        }

        const validImages = images.every(
            (image) => image.url && image.public_id
        );

        if (!validImages) {
            return NextResponse.json(
                { message: "Invalid product images" },
                { status: 400 }
            );
        }

        const selectedCategory = await Category.findOne({
            _id: category,
            isActive: true,
        });

        if (!selectedCategory) {
            return NextResponse.json(
                { message: "Please select an active category" },
                { status: 400 }
            );
        }

        const slug = createSlug(name);

        const existingProduct = await Product.findOne({ slug });

        if (existingProduct) {
            return NextResponse.json(
                { message: "A product with this name already exists" },
                { status: 409 }
            );
        }

        const cleanToppings = Array.isArray(toppings)
            ? toppings
                .filter((item) => item.name?.trim())
                .map((item) => ({
                    name: item.name.trim(),
                    price: Number(item.price) || 0,
                }))
            : [];

        const product = await Product.create({
            name: name.trim(),
            slug,
            description: description.trim(),
            price: Number(price),
            images,
            category: selectedCategory._id,
            sizes: sizes.map((size) => ({
                name: size.name.trim(),
                price: Number(size.price),
            })),
            toppings: cleanToppings,
            isFeatured: Boolean(isFeatured),
        });

        return NextResponse.json(
            {
                message: "Product created successfully",
                product,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Create product error:", error);

        return NextResponse.json(
            { message: "Failed to create product" },
            { status: 500 }
        );
    }
}
