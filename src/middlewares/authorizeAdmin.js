import { authenticateUser } from "./authenticateUser";

export async function authorizeAdmin() {
    try {
        const user = await authenticateUser();

        if (!user) {
            return null;
        }

        if (user.role !== "admin") {
            return null;
        }

        return user;
    } catch (error) {
        console.error("Admin authorization error:", error);
        return null;
    }
}