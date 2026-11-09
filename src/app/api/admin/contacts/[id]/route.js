
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Contact from "@/models/Contact";
import { authorizeAdmin } from "@/middlewares/authorizeAdmin";

const allowedStatuses = ["New", "Read", "Replied"];

export async function PATCH(request, { params }) {
    try {
        const admin = await authorizeAdmin();

        if (!admin) {
            return NextResponse.json(
                { success: false, message: "Unauthorized access" },
                { status: 401 }
            );
        }

        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { success: false, message: "Invalid message ID" },
                { status: 400 }
            );
        }

        const { status } = await request.json();

        if (!allowedStatuses.includes(status)) {
            return NextResponse.json(
                { success: false, message: "Invalid message status" },
                { status: 400 }
            );
        }

        await connectDB();

        const contact = await Contact.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        );

        if (!contact) {
            return NextResponse.json(
                { success: false, message: "Message not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "Message status updated",
                contact,
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("Update contact error:", error);

        return NextResponse.json(
            { success: false, message: "Failed to update message" },
            { status: 500 }
        );
    }
}

export async function DELETE(request, { params }) {
    try {
        const admin = await authorizeAdmin();

        if (!admin) {
            return NextResponse.json(
                { success: false, message: "Unauthorized access" },
                { status: 401 }
            );
        }

        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { success: false, message: "Invalid message ID" },
                { status: 400 }
            );
        }

        await connectDB();

        const contact = await Contact.findByIdAndDelete(id);

        if (!contact) {
            return NextResponse.json(
                { success: false, message: "Message not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "Message deleted successfully",
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("Delete contact error:", error);

        return NextResponse.json(
            { success: false, message: "Failed to delete message" },
            { status: 500 }
        );
    }
}
