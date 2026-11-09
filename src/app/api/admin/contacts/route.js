
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Contact from "@/models/Contact";
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

        const contacts = await Contact.find()
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json(
            {
                success: true,
                contacts,
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("Admin contacts API error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch messages",
            },
            { status: 500 }
        );
    }
}
