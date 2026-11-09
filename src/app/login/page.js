
"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { Pizza, Mail, Lock, Eye, EyeOff } from "lucide-react";

function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const redirect = searchParams.get("redirect") || "/";

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.email || !form.password) {
            return toast.error("Please enter email and password");
        }

        try {
            setLoading(true);

            const { data } = await axios.post(
                "/api/auth/login",
                form,
                { withCredentials: true }
            );

            if (data.success) {
                toast.success("Login successful!");

                router.replace(
                    redirect.startsWith("/") && !redirect.startsWith("//")
                        ? redirect
                        : "/"
                );

                router.refresh();
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Login failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-[80vh] bg-[#FFF8EF] flex items-center justify-center px-4 py-16">

            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 sm:p-9">

                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-[#E94B35] rounded-2xl flex items-center justify-center mx-auto">
                        <Pizza size={34} className="text-white" />
                    </div>

                    <h1 className="text-3xl font-extrabold text-[#171717] mt-5">
                        Welcome <span className="text-[#E94B35]">Back!</span>
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Login to your Pizza House account
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Email Address
                        </label>

                        <div className="relative">
                            <Mail size={19} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                autoComplete="email"
                                required
                                className="w-full border border-gray-200 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-[#E94B35] transition"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Password
                        </label>

                        <div className="relative">
                            <Lock size={19} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                required
                                className="w-full border border-gray-200 rounded-xl py-3 pl-12 pr-12 outline-none focus:border-[#E94B35] transition"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                            >
                                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#E94B35] text-white py-3 rounded-xl font-bold hover:bg-[#171717] transition disabled:opacity-60"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                </form>

                <p className="text-center text-gray-600 text-sm mt-7">
                    Don't have an account?{" "}
                    <Link
                        href="/register"
                        className="text-[#E94B35] font-bold hover:underline"
                    >
                        Register Now
                    </Link>
                </p>

            </div>
        </main>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-[70vh]" />}>
            <LoginContent />
        </Suspense>
    );
}
