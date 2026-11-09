
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    Pizza,
    Tags,
    ShoppingBag,
    Users,
    Settings,
    LogOut,
    Mail,
    X,
} from "lucide-react";
import toast from "react-hot-toast";

const menuItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: Pizza },
    { name: "Categories", href: "/admin/categories", icon: Tags },
    { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { name: "Customers", href: "/admin/customers", icon: Users },
    { name: "Contact Messages", href: "/admin/contacts", icon: Mail, },
    { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar({ closeSidebar }) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            const response = await fetch("/api/auth/logout", {
                method: "POST",
            });

            if (!response.ok) {
                throw new Error("Logout failed");
            }

            toast.success("Logged out successfully");
            router.replace("/admin/login");
            router.refresh();
        } catch (error) {
            toast.error("Could not log out. Please try again.");
        }
    };

    return (
        <aside className="flex h-full w-64 flex-col bg-[#171717] text-white">
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
                <div>
                    <h2 className="text-2xl font-bold">
                        Pizza <span className="text-[#E94B35]">House</span>
                    </h2>
                    <p className="mt-1 text-xs text-gray-400">ADMIN PANEL</p>
                </div>

                {closeSidebar && (
                    <button onClick={closeSidebar} className="lg:hidden">
                        <X size={22} />
                    </button>
                )}
            </div>

            <nav className="flex-1 space-y-2 px-4 py-6">
                <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Main Menu
                </p>

                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const active = pathname === item.href ||
                        (item.href !== "/admin/dashboard" &&
                            pathname.startsWith(item.href));

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={closeSidebar}
                            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                                active
                                    ? "bg-[#E94B35] text-white"
                                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                            }`}
                        >
                            <Icon size={19} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="border-t border-white/10 p-4">
                <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-gray-300 transition hover:bg-red-500/10 hover:text-red-400"
                >
                    <LogOut size={19} />
                    Logout
                </button>
            </div>
        </aside>
    );
}
