
"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import AdminSidebar from "./AdminSidebar";

export default function AdminShell({ children }) {
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    if (pathname === "/admin/login") {
        return children;
    }

    return (
        <div className="min-h-screen bg-[#FFF8EF] lg:flex">
            <div className="hidden lg:block">
                <AdminSidebar />
            </div>

            {sidebarOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <button
                        aria-label="Close sidebar"
                        onClick={() => setSidebarOpen(false)}
                        className="absolute inset-0 bg-black/50"
                    />
                    <div className="relative h-full w-64">
                        <AdminSidebar closeSidebar={() => setSidebarOpen(false)} />
                    </div>
                </div>
            )}

            <main className="min-w-0 flex-1">
                <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-5 md:px-8">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="rounded-lg p-2 hover:bg-gray-100 lg:hidden"
                        aria-label="Open menu"
                    >
                        <Menu size={23} />
                    </button>

                    <h1 className="text-lg font-bold text-[#171717]">
                        Admin Panel
                    </h1>

                    <span className="rounded-full bg-orange-50 px-4 py-2 text-sm font-medium text-[#E94B35]">
                        Pizza House
                    </span>
                </header>

                <div className="p-5 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
