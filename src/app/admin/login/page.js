
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole, Mail, Eye, EyeOff, Pizza } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminLoginPage() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Login failed");
            }

            if (data.user?.role !== "admin") {
                await fetch("/api/auth/logout", { method: "POST" });
                throw new Error("You are not authorized as an admin");
            }

            toast.success("Welcome to Pizza House Admin!");
            router.replace("/admin/dashboard");
            router.refresh();

        } catch (error) {
            toast.error(error.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#FFF8EF] px-4 py-10">
            <div className="w-full max-w-md rounded-3xl border border-gray-100 bg-white p-8 shadow-xl">

                <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E94B35] text-white">
                        <Pizza size={34} />
                    </div>

                    <h1 className="text-3xl font-bold text-[#171717]">
                        Pizza <span className="text-[#E94B35]">House</span>
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        Admin Panel Login
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                            Admin Email
                        </label>

                        <div className="flex items-center rounded-xl border border-gray-200 px-4 focus-within:border-[#E94B35]">
                            <Mail size={19} className="text-gray-400" />

                            <input
                                type="email"
                                name="email"
                                placeholder="Enter admin email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full bg-transparent px-3 py-3 outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                            Password
                        </label>

                        <div className="flex items-center rounded-xl border border-gray-200 px-4 focus-within:border-[#E94B35]">
                            <LockKeyhole size={19} className="text-gray-400" />

                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Enter password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full bg-transparent px-3 py-3 outline-none"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-gray-400"
                            >
                                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl bg-[#E94B35] py-3 font-bold text-white transition hover:bg-[#c93625] disabled:opacity-60"
                    >
                        {loading ? "Logging in..." : "Login to Dashboard"}
                    </button>

                </form>

                <p className="mt-6 text-center text-xs text-gray-400">
                    Secure Admin Access · Pizza House
                </p>
            </div>
        </div>
    );
}
