import { cookies } from "next/headers";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import {
    COOKIE_NAME,
    verifyToken,
} from "@/lib/jwt";

export async function authenticateUser() {
    try {
        const cookieStore = await cookies();

        const token = cookieStore.get(COOKIE_NAME)?.value;

        if (!token) {
            return null;
        }

        const decoded = await verifyToken(token);

        if (!decoded) {
            return null;
        }

        await connectDB();

        const user = await User.findById(decoded.userId);

        if (!user || !user.isActive) {
            return null;
        }

        return user;
    } catch (error) {
        console.error("Authentication error:", error);
        return null;
    }
}