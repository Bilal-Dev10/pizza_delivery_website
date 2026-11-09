
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import User from "@/models/User";
import Product from "@/models/Product";
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

        const [
            totalOrders,
            totalCustomers,
            totalProducts,
            pendingOrders,
            deliveredOrders,
            revenueResult,
            recentOrders,
        ] = await Promise.all([
            Order.countDocuments(),

            User.countDocuments({
                role: "customer",
            }),

            Product.countDocuments(),

            Order.countDocuments({
                status: "Pending",
            }),

            Order.countDocuments({
                status: "Delivered",
            }),

            Order.aggregate([
                {
                    $match: {
                        status: { $ne: "Cancelled" },
                        paymentStatus: { $ne: "Failed" },
                    },
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$totalAmount" },
                    },
                },
            ]),

            Order.find()
                .populate("user", "name email")
                .sort({ createdAt: -1 })
                .limit(5)
                .lean(),
        ]);

        const totalRevenue = revenueResult[0]?.total || 0;

        return NextResponse.json(
            {
                success: true,
                stats: {
                    totalOrders,
                    totalCustomers,
                    totalProducts,
                    pendingOrders,
                    deliveredOrders,
                    totalRevenue,
                },
                recentOrders,
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("Admin dashboard API error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch dashboard data",
            },
            { status: 500 }
        );
    }
}
