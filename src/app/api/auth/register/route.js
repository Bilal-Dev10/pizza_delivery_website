import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import connectDB from "@/lib/mongodb";
import User from "@/models/User";

import {
    generateToken,
    COOKIE_NAME,
    cookieOptions,
} from "@/lib/jwt";

export async function POST(request) {
    try {
        await connectDB();

        const body = await request.json();

        const { name, email, password, phone } = body;

        // Validation
        if (!name || !email || !password) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Name, email and password are required",
                },
                { status: 400 }
            );
        }

        if (typeof name !== "string" ||
            typeof email !== "string" ||
            typeof password !== "string") {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid input",
                },
                { status: 400 }
            );
        }

        if (name.trim().length < 2 || name.trim().length > 60) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Name must be between 2 and 60 characters",
                },
                { status: 400 }
            );
        }

        const normalizedEmail = email.trim().toLowerCase();

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Please enter a valid email",
                },
                { status: 400 }
            );
        }

        if (password.length < 8 || password.length > 72) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Password must be between 8 and 72 characters",
                },
                { status: 400 }
            );
        }

        // Check existing user
        const existingUser = await User.findOne({
            email: normalizedEmail,
        });

        if (existingUser) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Email already registered",
                },
                { status: 409 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create customer
        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            phone: typeof phone === "string" ? phone.trim() : "",
            role: "customer",
        });

        // Generate token
        const token = await generateToken(user);

        const response = NextResponse.json(
            {
                success: true,
                message: "Account created successfully",
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            },
            { status: 201 }
        );

        response.cookies.set(
            COOKIE_NAME,
            token,
            cookieOptions
        );

        return response;

    } catch (error) {
        console.error("Registration error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Registration failed",
            },
            { status: 500 }
        );
    }
}