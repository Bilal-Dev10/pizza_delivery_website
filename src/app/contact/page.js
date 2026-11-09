
"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
    MapPin,
    Phone,
    Mail,
    Clock,
    Send,
    MessageCircle,
} from "lucide-react";

export default function ContactPage() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !form.name.trim() ||
            !form.email.trim() ||
            !form.subject.trim() ||
            !form.message.trim()
        ) {
            toast.error("Please fill in all fields");
            return;
        }

        try {
            setLoading(true);

            // Contact API will be connected in the next step.
            const { data } = await axios.post("/api/contact", form);

            if (data.success) {
                toast.success("Message sent successfully!");
                setForm({
                    name: "",
                    email: "",
                    subject: "",
                    message: "",
                });
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Unable to send message. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="bg-[#FFF8EF] min-h-screen">

            {/* Header */}
            <section className="bg-[#171717] py-20 px-4 text-center">
                <p className="text-[#F4A62A] font-bold tracking-widest text-sm">
                    WE ARE HERE TO HELP
                </p>

                <h1 className="text-4xl sm:text-5xl font-extrabold text-white mt-4">
                    Contact <span className="text-[#E94B35]">Us</span>
                </h1>

                <p className="text-gray-300 max-w-xl mx-auto mt-5 leading-7">
                    Have a question or need help with your order?
                    Get in touch with Pizza House. We would love to hear from you.
                </p>
            </section>

            {/* Contact Information */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">

                    <div className="bg-white rounded-2xl p-7 shadow-sm text-center">
                        <div className="w-14 h-14 bg-orange-100 text-[#E94B35] rounded-xl flex items-center justify-center mx-auto">
                            <Phone size={26} />
                        </div>

                        <h3 className="font-bold text-xl text-[#171717] mt-5">
                            Call Us
                        </h3>

                        <p className="text-gray-500 mt-2">
                            +92 300 0000000
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl p-7 shadow-sm text-center">
                        <div className="w-14 h-14 bg-orange-100 text-[#E94B35] rounded-xl flex items-center justify-center mx-auto">
                            <Mail size={26} />
                        </div>

                        <h3 className="font-bold text-xl text-[#171717] mt-5">
                            Email Us
                        </h3>

                        <p className="text-gray-500 mt-2">
                            info@pizzahouse.com
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl p-7 shadow-sm text-center">
                        <div className="w-14 h-14 bg-orange-100 text-[#E94B35] rounded-xl flex items-center justify-center mx-auto">
                            <MapPin size={26} />
                        </div>

                        <h3 className="font-bold text-xl text-[#171717] mt-5">
                            Visit Us
                        </h3>

                        <p className="text-gray-500 mt-2">
                            Your restaurant address here
                        </p>
                    </div>

                </div>

                {/* Form and Opening Hours */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Contact Form */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6 sm:p-10">

                        <div className="mb-8">
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#171717]">
                                Send Us a Message
                            </h2>

                            <p className="text-gray-500 mt-2">
                                Fill out the form and our team will get back to you.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                                <div>
                                    <label className="block text-sm font-semibold text-[#171717] mb-2">
                                        Your Name
                                    </label>

                                    <input
                                        type="text"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        placeholder="Enter your name"
                                        maxLength={60}
                                        required
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#E94B35] transition"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-[#171717] mb-2">
                                        Email Address
                                    </label>

                                    <input
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder="Enter your email"
                                        maxLength={254}
                                        required
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#E94B35] transition"
                                    />
                                </div>

                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-[#171717] mb-2">
                                    Subject
                                </label>

                                <input
                                    type="text"
                                    name="subject"
                                    value={form.subject}
                                    onChange={handleChange}
                                    placeholder="Enter message subject"
                                    maxLength={120}
                                    required
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#E94B35] transition"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-[#171717] mb-2">
                                    Your Message
                                </label>

                                <textarea
                                    name="message"
                                    value={form.message}
                                    onChange={handleChange}
                                    placeholder="Write your message here..."
                                    rows={6}
                                    maxLength={2000}
                                    required
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#E94B35] transition resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center justify-center gap-2 bg-[#E94B35] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#171717] transition disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {loading ? "Sending..." : "Send Message"}
                                <Send size={18} />
                            </button>

                        </form>
                    </div>

                    {/* Opening Hours */}
                    <div className="bg-[#171717] text-white rounded-2xl p-7 sm:p-9 h-fit">

                        <div className="w-14 h-14 rounded-xl bg-[#E94B35] flex items-center justify-center">
                            <Clock size={28} />
                        </div>

                        <h2 className="text-2xl font-extrabold mt-6">
                            Opening Hours
                        </h2>

                        <p className="text-gray-400 mt-3 text-sm leading-6">
                            Visit us or order your favorite pizza during our
                            opening hours.
                        </p>

                        <div className="border-t border-white/10 mt-7 pt-6 space-y-5">

                            <div className="flex justify-between gap-3">
                                <span className="text-gray-400">Monday - Sunday</span>
                                <span className="font-semibold text-[#F4A62A]">
                                    12 PM - 12 AM
                                </span>
                            </div>

                        </div>

                        <div className="bg-white/5 rounded-xl p-5 mt-8">
                            <MessageCircle className="text-[#F4A62A]" size={25} />

                            <h3 className="font-bold mt-3">
                                Need Quick Help?
                            </h3>

                            <p className="text-gray-400 text-sm mt-2">
                                Call us for questions about your orders.
                            </p>
                        </div>

                    </div>

                </div>
            </section>
        </main>
    );
}
