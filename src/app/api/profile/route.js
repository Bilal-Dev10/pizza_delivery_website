
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { authenticateUser } from "@/middlewares/authenticateUser";

export async function GET() {
    try {
        const user = await authenticateUser();

        if (!user || user.role !== "customer") {
            return NextResponse.json(
                { success: false, message: "Unauthorized access" },
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
            },
        });
    } catch (error) {
        console.error("Profile GET error:", error);

        return NextResponse.json(
            { success: false, message: "Failed to fetch profile" },
            { status: 500 }
        );
    }
}

export async function PATCH(request) {
    try {
        const user = await authenticateUser();

        if (!user || user.role !== "customer") {
            return NextResponse.json(
                { success: false, message: "Unauthorized access" },
                { status: 401 }
            );
        }

        const body = await request.json();

        const name = String(body.name || "").trim();
        const phone = String(body.phone || "").trim();
        const address = String(body.address || "").trim();

        if (name.length < 2 || name.length > 60) {
            return NextResponse.json(
                { success: false, message: "Name must be 2 to 60 characters" },
                { status: 400 }
            );
        }

        if (phone && !/^[0-9+\-\s()]{10,20}$/.test(phone)) {
            return NextResponse.json(
                { success: false, message: "Please enter a valid phone number" },
                { status: 400 }
            );
        }

        if (address.length > 500) {
            return NextResponse.json(
                { success: false, message: "Address is too long" },
                { status: 400 }
            );
        }

        await connectDB();

        user.name = name;
        user.phone = phone;
        user.address = address;

        await user.save();

        return NextResponse.json({
            success: true,
            message: "Profile updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
            },
        });
    } catch (error) {
        console.error("Profile PATCH error:", error);

        return NextResponse.json(
            { success: false, message: "Failed to update profile" },
            { status: 500 }
        );
    }
}
