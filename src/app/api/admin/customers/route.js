import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { authorizeAdmin } from "@/middlewares/authorizeAdmin";

export async function GET() {
    try {
        const admin = await authorizeAdmin();

        if (!admin) {
            return NextResponse.json(
                { success: false, message: "Unauthorized access" },
                { status: 401 }
            );
        }

        await connectDB();

        const customers = await User.find({ role: "customer" })
            .select("name email phone address isActive createdAt")
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json(
            {
                success: true,
                customers,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Admin customers API error:", error);

        return NextResponse.json(
            { success: false, message: "Failed to fetch customers" },
            { status: 500 }
        );
    }
}