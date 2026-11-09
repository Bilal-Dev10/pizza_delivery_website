import { NextResponse } from "next/server";
import {
    COOKIE_NAME,
    cookieOptions,
} from "@/lib/jwt";

export async function POST() {
    try {
        const response = NextResponse.json({
            success: true,
            message: "Logout successful",
        });

        response.cookies.set(COOKIE_NAME, "", {
            ...cookieOptions,
            maxAge: 0,
            expires: new Date(0),
        });

        return response;

    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: "Logout failed",
            },
            { status: 500 }
        );
    }
}