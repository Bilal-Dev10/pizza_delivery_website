
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import {
    Pizza,
    User,
    Mail,
    Lock,
    Phone,
    Eye,
    EyeOff,
} from "lucide-react";

export default function RegisterPage() {
    const router = useRouter();

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
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

        if (form.name.trim().length < 2) {
            return toast.error("Name must contain at least 2 characters");
        }

        if (form.password.length < 6) {
            return toast.error("Password must be at least 6 characters");
        }

        if (form.password !== form.confirmPassword) {
            return toast.error("Passwords do not match");
        }

        try {
            setLoading(true);

            const { data } = await axios.post(
                "/api/auth/register",
                {
                    name: form.name.trim(),
                    email: form.email.trim().toLowerCase(),
                    phone: form.phone.trim(),
                    password: form.password,
                },
                { withCredentials: true }
            );

            if (data.success) {
                toast.success("Account created successfully!");

                router.replace("/");
                router.refresh();
            }

        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Registration failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-[80vh] bg-[#FFF8EF] flex items-center justify-center px-4 py-16">

            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 sm:p-9">

                {/* Header */}
                <div className="text-center mb-8">

                    <div className="w-16 h-16 bg-[#E94B35] rounded-2xl flex items-center justify-center mx-auto">
                        <Pizza size={34} className="text-white" />
                    </div>

                    <h1 className="text-3xl font-extrabold text-[#171717] mt-5">
                        Create <span className="text-[#E94B35]">Account</span>
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Join Pizza House and enjoy delicious pizzas
                    </p>

                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Full Name
                        </label>

                        <div className="relative">
                            <User size={19} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                autoComplete="name"
                                required
                                className="w-full border border-gray-200 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-[#E94B35] transition"
                            />
                        </div>
                    </div>

                    {/* Email */}
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

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Phone Number
                        </label>

                        <div className="relative">
                            <Phone size={19} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                            <input
                                type="tel"
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                placeholder="03XXXXXXXXX"
                                autoComplete="tel"
                                className="w-full border border-gray-200 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-[#E94B35] transition"
                            />
                        </div>
                    </div>

                    {/* Password */}
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
                                placeholder="Create a password"
                                autoComplete="new-password"
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

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Confirm Password
                        </label>

                        <div className="relative">
                            <Lock size={19} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                            <input
                                type="password"
                                name="confirmPassword"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm your password"
                                autoComplete="new-password"
                                required
                                className="w-full border border-gray-200 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-[#E94B35] transition"
                            />
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#E94B35] text-white py-3 rounded-xl font-bold hover:bg-[#171717] transition disabled:opacity-60"
                    >
                        {loading ? "Creating Account..." : "Create Account"}
                    </button>

                </form>

                {/* Login Link */}
                <p className="text-center text-gray-600 text-sm mt-7">
                    Already have an account?{" "}
                    <Link
                        href="/login"
                        className="text-[#E94B35] font-bold hover:underline"
                    >
                        Login Now
                    </Link>
                </p>

            </div>
        </main>
    );
}
