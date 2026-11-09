
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import { authenticateUser } from "@/middlewares/authenticateUser";

export async function GET() {
    try {
        // Check customer login
        const user = await authenticateUser();

        if (!user) {
            return NextResponse.json(
                { success: false, message: "Please login first" },
                { status: 401 }
            );
        }

        await connectDB();

        // Get customer's orders
        const orders = await Order.find({
            user: user._id,
        })
            .sort({ createdAt: -1 })
            .select(
                "orderNumber items subtotal deliveryFee totalAmount status paymentMethod paymentStatus deliveryAddress phone createdAt"
            )
            .lean();

        return NextResponse.json(
            {
                success: true,
                orders,
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("My orders API error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch your orders",
            },
            { status: 500 }
        );
    }
}
