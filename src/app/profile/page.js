
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Save,
    Loader2,
    ShoppingBag,
} from "lucide-react";

export default function ProfilePage() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await axios.get("/api/profile");

                if (data.success) {
                    setForm({
                        name: data.user.name || "",
                        email: data.user.email || "",
                        phone: data.user.phone || "",
                        address: data.user.address || "",
                    });
                }
            } catch (error) {
                toast.error(
                    error.response?.data?.message ||
                    "Failed to load profile"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.name.trim().length < 2) {
            return toast.error("Please enter your full name");
        }

        try {
            setSaving(true);

            const { data } = await axios.patch("/api/profile", {
                name: form.name,
                phone: form.phone,
                address: form.address,
            });

            if (data.success) {
                toast.success("Profile updated successfully!");
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to update profile"
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-[#E94B35]" size={35} />
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#FFF8EF] py-12 px-4">
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <div className="mb-8">
                    <p className="text-[#E94B35] font-semibold text-sm">
                        MY ACCOUNT
                    </p>

                    <h1 className="text-3xl sm:text-4xl font-bold text-[#171717] mt-2">
                        My Profile
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Manage your personal information and delivery details.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Sidebar */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-fit">
                        <div className="w-16 h-16 rounded-full bg-[#FFF0E8] flex items-center justify-center text-[#E94B35] mb-4">
                            <User size={32} />
                        </div>

                        <h2 className="font-bold text-xl text-[#171717]">
                            {form.name}
                        </h2>

                        <p className="text-gray-500 text-sm mt-1 break-all">
                            {form.email}
                        </p>

                        <div className="border-t border-gray-100 mt-6 pt-5">
                            <Link
                                href="/orders"
                                className="flex items-center gap-3 text-gray-700 hover:text-[#E94B35] font-medium"
                            >
                                <ShoppingBag size={19} />
                                My Orders
                            </Link>
                        </div>
                    </div>

                    {/* Profile Form */}
                    <div className="md:col-span-2 bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold text-[#171717] mb-6">
                            Personal Information
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-5">

                            {/* Name */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Full Name
                                </label>

                                <div className="relative">
                                    <User
                                        size={19}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                    />

                                    <input
                                        type="text"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        required
                                        minLength={2}
                                        maxLength={60}
                                        className="w-full border border-gray-200 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-[#E94B35]"
                                        placeholder="Enter your name"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Email Address
                                </label>

                                <div className="relative">
                                    <Mail
                                        size={19}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                    />

                                    <input
                                        type="email"
                                        value={form.email}
                                        disabled
                                        className="w-full border border-gray-200 bg-gray-50 text-gray-500 rounded-xl py-3 pl-12 pr-4 cursor-not-allowed"
                                    />
                                </div>

                                <p className="text-xs text-gray-400 mt-2">
                                    Email address cannot be changed here.
                                </p>
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Phone Number
                                </label>

                                <div className="relative">
                                    <Phone
                                        size={19}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                    />

                                    <input
                                        type="tel"
                                        name="phone"
                                        value={form.phone}
                                        onChange={handleChange}
                                        maxLength={20}
                                        className="w-full border border-gray-200 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-[#E94B35]"
                                        placeholder="03XXXXXXXXX"
                                    />
                                </div>
                            </div>

                            {/* Address */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Delivery Address
                                </label>

                                <div className="relative">
                                    <MapPin
                                        size={19}
                                        className="absolute left-4 top-4 text-gray-400"
                                    />

                                    <textarea
                                        name="address"
                                        value={form.address}
                                        onChange={handleChange}
                                        rows={4}
                                        maxLength={500}
                                        className="w-full border border-gray-200 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-[#E94B35] resize-none"
                                        placeholder="Enter your complete delivery address"
                                    />
                                </div>
                            </div>

                            {/* Save Button */}
                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#E94B35] text-white px-7 py-3 rounded-xl font-semibold hover:bg-[#171717] transition disabled:opacity-60"
                            >
                                {saving ? (
                                    <>
                                        <Loader2 size={19} className="animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save size={19} />
                                        Save Changes
                                    </>
                                )}
                            </button>

                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}
