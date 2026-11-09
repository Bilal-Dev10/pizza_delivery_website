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

        const { email, password } = await request.json();

        if (
            typeof email !== "string" ||
            typeof password !== "string" ||
            !email.trim() ||
            !password
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Email and password are required",
                },
                { status: 400 }
            );
        }

        const normalizedEmail = email.trim().toLowerCase();

        // Find user and include password
        const user = await User.findOne({
            email: normalizedEmail,
        }).select("+password");

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid email or password",
                },
                { status: 401 }
            );
        }

        if (!user.isActive) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Your account is inactive",
                },
                { status: 403 }
            );
        }

        // Compare password
        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordValid) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid email or password",
                },
                { status: 401 }
            );
        }

        // Generate JWT
        const token = await generateToken(user);

        const response = NextResponse.json({
            success: true,
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });

        response.cookies.set(
            COOKIE_NAME,
            token,
            cookieOptions
        );

        return response;

    } catch (error) {
        console.error("Login error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Login failed",
            },
            { status: 500 }
        );
    }
}