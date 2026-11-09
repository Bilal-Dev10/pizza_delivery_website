
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Contact from "@/models/Contact";

export async function POST(request) {
    try {
        const body = await request.json();

        const name = String(body.name || "").trim();
        const email = String(body.email || "").trim().toLowerCase();
        const subject = String(body.subject || "").trim();
        const message = String(body.message || "").trim();

        // Validate required fields
        if (!name || !email || !subject || !message) {
            return NextResponse.json(
                {
                    success: false,
                    message: "All fields are required",
                },
                { status: 400 }
            );
        }

        // Validate lengths
        if (name.length < 2 || name.length > 60) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Name must be between 2 and 60 characters",
                },
                { status: 400 }
            );
        }

        if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Please enter a valid email address",
                },
                { status: 400 }
            );
        }

        if (subject.length < 3 || subject.length > 120) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Subject must be between 3 and 120 characters",
                },
                { status: 400 }
            );
        }

        if (message.length < 10 || message.length > 2000) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Message must be between 10 and 2000 characters",
                },
                { status: 400 }
            );
        }

        await connectDB();

        const contact = await Contact.create({
            name,
            email,
            subject,
            message,
        });

        return NextResponse.json(
            {
                success: true,
                message: "Your message has been sent successfully",
                contactId: contact._id,
            },
            { status: 201 }
        );

    } catch (error) {
        console.error("Contact API error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to send your message. Please try again.",
            },
            { status: 500 }
        );
    }
}
