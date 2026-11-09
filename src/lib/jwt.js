import { SignJWT, jwtVerify } from "jose";

const secret = process.env.JWT_SECRET;

if (!secret) {
    throw new Error("JWT_SECRET is missing from environment variables");
}

const SECRET_KEY = new TextEncoder().encode(secret);

export async function generateToken(user) {
    const token = await new SignJWT({
        userId: user._id.toString(),
        role: user.role,
    })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(SECRET_KEY);

    return token;
}

export async function verifyToken(token) {
    try {
        const { payload } = await jwtVerify(
            token,
            SECRET_KEY,
            {
                algorithms: ["HS256"],
            }
        );

        if (!payload.userId || !payload.role) {
            return null;
        }

        return payload;
    } catch (error) {
        return null;
    }
}

export const COOKIE_NAME = "pizza-token";

export const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
};