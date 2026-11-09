
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import {
    Menu,
    X,
    ShoppingCart,
    User,
    LogOut,
    ClipboardList,
    Pizza,
} from "lucide-react";

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();

    const [user, setUser] = useState(null);
    const [cartCount, setCartCount] = useState(0);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        try {
            const { data } = await axios.get("/api/auth/me");

            if (data.success) {
                setUser(data.user);
            }
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const updateCartCount = () => {
        try {
            const cart = JSON.parse(
                localStorage.getItem("pizza-cart") || "[]"
            );

            setCartCount(
                cart.reduce(
                    (total, item) => total + Number(item.quantity || 0),
                    0
                )
            );
        } catch {
            setCartCount(0);
        }
    };

    useEffect(() => {
        console.log("first useeffect....");
        fetchUser();
        updateCartCount();

        const handleCartUpdate = () => updateCartCount();
        const handleFocus = () => {
            fetchUser();
            updateCartCount();
        };

        window.addEventListener("cart-updated", handleCartUpdate);
        window.addEventListener("storage", handleCartUpdate);
        window.addEventListener("focus", handleFocus);


        return () => {
            window.removeEventListener("cart-updated", handleCartUpdate);
            window.removeEventListener("storage", handleCartUpdate);
            window.removeEventListener("focus", handleFocus);
        };
    }, []);

    useEffect(() => {
         fetchUser();
        setMobileOpen(false);
    }, [pathname]);

    const handleLogout = async () => {
        try {
            await axios.post("/api/auth/logout");
            setUser(null);
            toast.success("Logged out successfully");
            router.push("/login");
            router.refresh();
        } catch {
            toast.error("Logout failed");
        }
    };

    const navLink =
        "text-gray-700 hover:text-[#E94B35] font-medium transition";

    return (
        <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="h-20 flex items-center justify-between">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-11 h-11 rounded-xl bg-[#E94B35] text-white flex items-center justify-center">
                            <Pizza size={26} />
                        </div>

                        <div>
                            <h1 className="text-xl font-extrabold text-[#171717]">
                                Pizza <span className="text-[#E94B35]">House</span>
                            </h1>
                            <p className="text-[10px] tracking-widest text-gray-500">
                                FRESH & DELICIOUS
                            </p>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-8">
                        <Link href="/" className={navLink}>Home</Link>
                        <Link href="/menu" className={navLink}>Menu</Link>
                        <Link href="/about" className={navLink}>About</Link>
                        <Link href="/contact" className={navLink}>Contact</Link>

                        {user?.role === "customer" && (
                            <>
                                <Link href="/orders" className={navLink}>
                                    My Orders
                                </Link>
                                <Link href="/profile" className={navLink}>
                                    My Profile
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden lg:flex items-center gap-4">
                        <Link
                            href="/cart"
                            className="relative p-2 text-[#171717] hover:text-[#E94B35]"
                        >
                            <ShoppingCart size={24} />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-[#E94B35] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                                    {cartCount > 99 ? "99+" : cartCount}
                                </span>
                            )}
                        </Link>

                        {!loading && (
                            user ? (
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 bg-[#171717] text-white px-5 py-2.5 rounded-xl hover:bg-[#E94B35] transition"
                                >
                                    <LogOut size={17} />
                                    Logout
                                </button>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="font-semibold text-gray-700 hover:text-[#E94B35]"
                                    >
                                        Login
                                    </Link>

                                    <Link
                                        href="/register"
                                        className="bg-[#E94B35] text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-[#171717] transition"
                                    >
                                        Register
                                    </Link>
                                </>
                            )
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="lg:hidden p-2 text-[#171717]"
                        aria-label="Toggle navigation"
                    >
                        {mobileOpen ? <X size={27} /> : <Menu size={27} />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {mobileOpen && (
                    <div className="lg:hidden border-t border-gray-100 py-5 space-y-4">
                        <Link href="/" className="block py-1 text-gray-700">
                            Home
                        </Link>

                        <Link href="/menu" className="block py-1 text-gray-700">
                            Menu
                        </Link>

                        <Link href="/about" className="block py-1 text-gray-700">
                            About
                        </Link>

                        <Link href="/contact" className="block py-1 text-gray-700">
                            Contact
                        </Link>

                        <Link href="/cart" className="flex items-center gap-2 py-1 text-gray-700">
                            <ShoppingCart size={19} />
                            Cart ({cartCount})
                        </Link>

                        {user?.role === "customer" && (
                            <>
                                <Link href="/orders" className="flex items-center gap-2 py-1 text-gray-700">
                                    <ClipboardList size={19} />
                                    My Orders
                                </Link>

                                <Link href="/profile" className="flex items-center gap-2 py-1 text-gray-700">
                                    <User size={19} />
                                    My Profile
                                </Link>
                            </>
                        )}

                        {!loading && (
                            user ? (
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 text-[#E94B35] font-semibold"
                                >
                                    <LogOut size={19} />
                                    Logout
                                </button>
                            ) : (
                                <div className="flex gap-4 pt-2">
                                    <Link href="/login" className="font-semibold text-gray-700">
                                        Login
                                    </Link>

                                    <Link href="/register" className="font-semibold text-[#E94B35]">
                                        Register
                                    </Link>
                                </div>
                            )
                        )}
                    </div>
                )}
            </nav>
        </header>
    );
}
