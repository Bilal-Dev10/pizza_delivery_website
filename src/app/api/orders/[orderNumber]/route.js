
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import { authenticateUser } from "@/middlewares/authenticateUser";

export async function GET(request, { params }) {
    try {
        const user = await authenticateUser();

        if (!user) {
            return NextResponse.json(
                { success: false, message: "Please login first" },
                { status: 401 }
            );
        }

        const { orderNumber } = await params;

        await connectDB();

        const order = await Order.findOne({
            orderNumber,
            user: user._id,
        }).lean();

        if (!order) {
            return NextResponse.json(
                { success: false, message: "Order not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, order },
            { status: 200 }
        );

    } catch (error) {
        console.error("Get order details error:", error);

        return NextResponse.json(
            { success: false, message: "Failed to fetch order" },
            { status: 500 }
        );
    }
}
