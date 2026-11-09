// import { NextResponse } from "next/server";
// import connectDB from "@/lib/mongodb";
// import Product from "@/models/Product";

// export async function GET() {
//     try {
//         await connectDB();

//         const products = await Product.find({
//             isAvailable: true,
//         })
//             .populate({
//                 path: "category",
//                 match: { isActive: true },
//                 select: "name slug",
//             })
//             .sort({ createdAt: -1 })
//             .lean();

//         const availableProducts = products.filter(
//             (product) => product.category !== null
//         );

//         return NextResponse.json(
//             {
//                 success: true,
//                 products: availableProducts,
//             },
//             { status: 200 }
//         );

//     } catch (error) {
//         console.error("Public products API error:", error);

//         return NextResponse.json(
//             {
//                 success: false,
//                 message: "Failed to fetch products",
//             },
//             { status: 500 }
//         );
//     }
// }




import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";

export async function GET() {
    try {
        await connectDB();

        // Register Category model before populate
        void Category;

        const products = await Product.find({
            isAvailable: true,
        })
            .populate({
                path: "category",
                match: { isActive: true },
                select: "name slug",
            })
            .sort({ createdAt: -1 })
            .lean();

        const availableProducts = products.filter(
            (product) => product.category !== null
        );

        return NextResponse.json(
            {
                success: true,
                products: availableProducts,
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("Public products API error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch products",
            },
            { status: 500 }
        );
    }
}
