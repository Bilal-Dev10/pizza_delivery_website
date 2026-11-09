
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import {
    ArrowRight,
    Clock,
    Truck,
    ShieldCheck,
    Star,
    Pizza,
} from "lucide-react";

export default function HomePage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await axios.get("/api/products");

                if (data.success) {
                    setProducts(data.products.slice(0, 4));
                }
            } catch (error) {
                console.error("Homepage products error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <main className="bg-[#FFF8EF]">

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-[#171717]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 grid grid-cols-1 lg:grid-cols-2 items-center gap-12">

                    <div className="text-center lg:text-left">
                        <span className="inline-block bg-[#E94B35]/15 text-[#F4A62A] px-5 py-2 rounded-full text-sm font-semibold mb-6">
                            FRESHLY BAKED EVERY DAY
                        </span>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
                            Delicious Pizza,
                            <span className="block text-[#E94B35]">
                                Happy Moments!
                            </span>
                        </h1>

                        <p className="text-gray-300 text-base sm:text-lg leading-8 mt-6 max-w-xl mx-auto lg:mx-0">
                            Enjoy freshly prepared pizzas made with quality
                            ingredients, delicious toppings, and lots of love.
                            Your favorite pizza is just one click away.
                        </p>

                        <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 mt-9">
                            <Link
                                href="/menu"
                                className="inline-flex items-center justify-center gap-2 bg-[#E94B35] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#F4A62A] hover:text-[#171717] transition"
                            >
                                Order Now
                                <ArrowRight size={20} />
                            </Link>

                            <Link
                                href="/menu"
                                className="inline-flex items-center justify-center border border-white/30 text-white px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-[#171717] transition"
                            >
                                Explore Menu
                            </Link>
                        </div>

                        <div className="flex flex-wrap justify-center lg:justify-start gap-6 mt-10 text-sm text-gray-300">
                            <span className="flex items-center gap-2">
                                <Star size={18} className="text-[#F4A62A]" />
                                Fresh Ingredients
                            </span>

                            <span className="flex items-center gap-2">
                                <Clock size={18} className="text-[#F4A62A]" />
                                Fast Service
                            </span>
                        </div>
                    </div>

                    {/* Hero Image */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-[#E94B35]/20 blur-3xl rounded-full" />

                        <div className="relative aspect-square max-w-xl mx-auto rounded-full border-8 border-[#F4A62A]/20 overflow-hidden shadow-2xl">
                            <Image
                                src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1000"
                                alt="Freshly baked delicious pizza"
                                fill
                                priority
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                    <div className="bg-white p-7 rounded-2xl shadow-sm flex items-center gap-5">
                        <div className="w-14 h-14 rounded-xl bg-orange-100 text-[#E94B35] flex items-center justify-center shrink-0">
                            <Pizza size={28} />
                        </div>

                        <div>
                            <h3 className="font-bold text-[#171717]">
                                Fresh Ingredients
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                                Quality ingredients in every pizza.
                            </p>
                        </div>
                    </div>

                    <div className="bg-white p-7 rounded-2xl shadow-sm flex items-center gap-5">
                        <div className="w-14 h-14 rounded-xl bg-yellow-100 text-[#E94B35] flex items-center justify-center shrink-0">
                            <Truck size={28} />
                        </div>

                        <div>
                            <h3 className="font-bold text-[#171717]">
                                Fast Delivery
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                                Fresh pizza delivered to your door.
                            </p>
                        </div>
                    </div>

                    <div className="bg-white p-7 rounded-2xl shadow-sm flex items-center gap-5">
                        <div className="w-14 h-14 rounded-xl bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                            <ShieldCheck size={28} />
                        </div>

                        <div>
                            <h3 className="font-bold text-[#171717]">
                                Quality & Taste
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                                Delicious food made with care.
                            </p>
                        </div>
                    </div>

                </div>
            </section>

            {/* Featured Products */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
                    <div>
                        <p className="text-[#E94B35] font-bold text-sm">
                            OUR SPECIAL MENU
                        </p>

                        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#171717] mt-2">
                            Our Popular Pizzas
                        </h2>

                        <p className="text-gray-500 mt-3">
                            Taste the pizzas everyone loves.
                        </p>
                    </div>

                    <Link
                        href="/menu"
                        className="flex items-center gap-2 text-[#E94B35] font-bold hover:gap-3 transition-all"
                    >
                        View Full Menu
                        <ArrowRight size={19} />
                    </Link>
                </div>

                {loading ? (
                    <div className="py-16 text-center text-gray-500">
                        Loading delicious pizzas...
                    </div>
                ) : products.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center">
                        <Pizza size={45} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="font-bold text-xl text-[#171717]">
                            No pizzas available yet
                        </h3>
                        <p className="text-gray-500 mt-2">
                            Please check back soon.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <Link
                                href={`/menu/${product.slug}`}
                                key={product._id}
                                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition"
                            >
                                <div className="relative h-56 overflow-hidden bg-gray-100">
                                    {product.images?.[0]?.url && (
                                        <Image
                                            src={product.images[0].url}
                                            alt={product.name}
                                            fill
                                            sizes="(max-width: 768px) 100vw, 25vw"
                                            className="object-cover group-hover:scale-110 transition duration-500"
                                        />
                                    )}

                                    {product.isFeatured && (
                                        <span className="absolute top-4 left-4 bg-[#F4A62A] text-[#171717] px-3 py-1 rounded-full text-xs font-bold">
                                            Featured
                                        </span>
                                    )}
                                </div>

                                <div className="p-5">
                                    <p className="text-xs text-[#E94B35] font-semibold">
                                        {product.category?.name || "Pizza"}
                                    </p>

                                    <h3 className="text-lg font-bold text-[#171717] mt-2">
                                        {product.name}
                                    </h3>

                                    <div className="flex items-center justify-between mt-5">
                                        <p className="text-xl font-extrabold text-[#E94B35]">
                                            Rs. {Number(product.price).toLocaleString("en-PK")}
                                        </p>

                                        <span className="w-10 h-10 rounded-full bg-[#E94B35] text-white flex items-center justify-center group-hover:bg-[#171717] transition">
                                            <ArrowRight size={19} />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>

            {/* Special Offer */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="relative overflow-hidden rounded-3xl bg-[#E94B35] p-8 sm:p-14 text-white">
                    <div className="relative z-10 max-w-2xl">
                        <p className="font-bold text-[#171717] tracking-widest text-sm">
                            PIZZA HOUSE SPECIAL
                        </p>

                        <h2 className="text-3xl sm:text-5xl font-extrabold mt-4">
                            Make Every Meal Special!
                        </h2>

                        <p className="text-white/90 mt-5 leading-7">
                            Explore our delicious pizza collection and find
                            your new favorite flavor.
                        </p>

                        <Link
                            href="/menu"
                            className="inline-flex items-center gap-2 bg-[#171717] text-white px-7 py-4 rounded-xl font-bold mt-8 hover:bg-white hover:text-[#171717] transition"
                        >
                            Explore Our Menu
                            <ArrowRight size={20} />
                        </Link>
                    </div>

                    <div className="absolute -right-16 -bottom-28 w-80 h-80 rounded-full border-[35px] border-white/10" />
                    <div className="absolute right-20 -top-20 w-48 h-48 rounded-full bg-white/10" />
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="text-center py-20 px-4">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#171717]">
                    Hungry? Let's Order!
                </h2>

                <p className="text-gray-500 mt-4 max-w-xl mx-auto">
                    Your favorite pizza is waiting. Order today and enjoy
                    delicious flavors at home.
                </p>

                <Link
                    href="/menu"
                    className="inline-flex items-center gap-2 bg-[#E94B35] text-white px-8 py-4 rounded-xl font-bold mt-7 hover:bg-[#171717] transition"
                >
                    Order Your Pizza
                    <ArrowRight size={20} />
                </Link>
            </section>

        </main>
    );
}
