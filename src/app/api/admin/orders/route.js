
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import { authorizeAdmin } from "@/middlewares/authorizeAdmin";

export async function GET() {
    try {
        const admin = await authorizeAdmin();

        if (!admin) {
            return NextResponse.json(
                { success: false, message: "Unauthorized access" },
                { status: 403 }
            );
        }

        await connectDB();

        const orders = await Order.find()
            .populate("user", "name email")
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json(
            { success: true, orders },
            { status: 200 }
        );

    } catch (error) {
        console.error("Admin orders API error:", error);

        return NextResponse.json(
            { success: false, message: "Failed to fetch orders" },
            { status: 500 }
        );
    }
}
