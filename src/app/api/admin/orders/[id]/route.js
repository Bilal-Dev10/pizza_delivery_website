
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import { authorizeAdmin } from "@/middlewares/authorizeAdmin";

const VALID_STATUSES = [
    "Pending",
    "Confirmed",
    "Preparing",
    "Out for Delivery",
    "Delivered",
    "Cancelled",
];

const VALID_PAYMENT_STATUSES = [
    "Pending",
    "Paid",
    "Failed",
];

export async function PATCH(request, { params }) {
    try {
        const admin = await authorizeAdmin();

        if (!admin) {
            return NextResponse.json(
                { success: false, message: "Unauthorized access" },
                { status: 403 }
            );
        }

        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { success: false, message: "Invalid order ID" },
                { status: 400 }
            );
        }

        const body = await request.json();
        const { status, paymentStatus } = body;

        if (
            status === undefined &&
            paymentStatus === undefined
        ) {
            return NextResponse.json(
                { success: false, message: "No update provided" },
                { status: 400 }
            );
        }

        if (
            status !== undefined &&
            !VALID_STATUSES.includes(status)
        ) {
            return NextResponse.json(
                { success: false, message: "Invalid order status" },
                { status: 400 }
            );
        }

        if (
            paymentStatus !== undefined &&
            !VALID_PAYMENT_STATUSES.includes(paymentStatus)
        ) {
            return NextResponse.json(
                { success: false, message: "Invalid payment status" },
                { status: 400 }
            );
        }

        await connectDB();

        const order = await Order.findById(id);

        if (!order) {
            return NextResponse.json(
                { success: false, message: "Order not found" },
                { status: 404 }
            );
        }

        if (status !== undefined && order.status !== status) {
            order.status = status;

            order.statusHistory.push({
                status,
                updatedAt: new Date(),
            });
        }

        if (paymentStatus !== undefined) {
            order.paymentStatus = paymentStatus;
        }

        await order.save();

        return NextResponse.json(
            {
                success: true,
                message: "Order updated successfully",
                order,
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("Update order API error:", error);

        return NextResponse.json(
            { success: false, message: "Failed to update order" },
            { status: 500 }
        );
    }
}
