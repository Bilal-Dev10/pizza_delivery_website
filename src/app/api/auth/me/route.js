import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import { authenticateUser } from "@/middlewares/authenticateUser";

export async function GET() {
    try {
        await connectDB();

        const user = await authenticateUser();

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized",
                },
                { status: 401 }
            );
        }

        return NextResponse.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role,
            },
        });

    } catch (error) {
        console.error("Get user error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Unable to get user",
            },
            { status: 500 }
        );
    }
}