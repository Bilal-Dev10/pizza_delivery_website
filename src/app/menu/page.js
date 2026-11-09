"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Plus, Pizza, Search } from "lucide-react";

export default function MenuPage() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState(["All"]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProducts() {
            try {
                const response = await fetch("/api/products");
                const data = await response.json();

                if (data.success) {
                    setProducts(data.products);

                    const uniqueCategories = [
                        ...new Set(
                            data.products.map((product) => product.category.name)
                        ),
                    ];

                    setCategories(["All", ...uniqueCategories]);
                }
            } catch (error) {
                console.error("Products loading error:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchProducts();
    }, []);

    const filteredProducts = products.filter((product) => {
        const matchesCategory =
            selectedCategory === "All" ||
            product.category.name === selectedCategory;

        const matchesSearch = product.name
            .toLowerCase()
            .includes(search.toLowerCase());

        return matchesCategory && matchesSearch;
    });

    return (
        <main className="min-h-screen bg-[#FFF8EF]">
            {/* Hero */}
            <section className="bg-[#171717] px-6 py-16 text-center text-white">
                <span className="text-sm font-bold uppercase tracking-[4px] text-[#F4A62A]">
                    Fresh & Delicious
                </span>

                <h1 className="mt-4 text-4xl font-extrabold md:text-6xl">
                    Our <span className="text-[#E94B35]">Pizza Menu</span>
                </h1>

                <p className="mx-auto mt-5 max-w-xl text-gray-300">
                    Discover your favorite pizzas, made fresh with delicious
                    ingredients and lots of love.
                </p>

                <Link
                    href="/"
                    className="mt-8 inline-block rounded-lg bg-[#E94B35] px-7 py-3 font-bold text-white transition hover:bg-[#c93827]"
                >
                    Back to Home
                </Link>
            </section>

            {/* Menu */}
            <section className="mx-auto max-w-7xl px-5 py-14">
                <div className="mb-9 flex flex-col justify-between gap-5 md:flex-row md:items-center">
                    <div>
                        <h2 className="text-3xl font-extrabold text-[#171717]">
                            Explore Our Pizzas
                        </h2>
                        <p className="mt-2 text-gray-500">
                            Choose your favorite and enjoy!
                        </p>
                    </div>

                    <div className="relative w-full md:max-w-sm">
                        <Search
                            size={20}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                            type="text"
                            placeholder="Search pizza..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-4 outline-none focus:border-[#E94B35]"
                        />
                    </div>
                </div>

                {/* Categories */}
                <div className="mb-10 flex flex-wrap gap-3">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`rounded-full px-6 py-2.5 font-semibold transition ${selectedCategory === category
                                    ? "bg-[#E94B35] text-white"
                                    : "border border-gray-200 bg-white text-gray-700 hover:border-[#E94B35] hover:text-[#E94B35]"
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Products */}
                {loading ? (
                    <div className="py-20 text-center text-gray-500">
                        Loading delicious pizzas...
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="rounded-2xl bg-white py-20 text-center">
                        <Pizza size={48} className="mx-auto text-[#E94B35]" />
                        <h3 className="mt-4 text-xl font-bold text-gray-800">
                            No pizzas found
                        </h3>
                        <p className="mt-2 text-gray-500">
                            Try another category or search.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredProducts.map((product) => (
                            <div
                                key={product._id}
                                className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
                            >
                                <div className="relative h-56 overflow-hidden bg-gray-100">
                                    {product.images?.[0]?.url ? (
                                        <Image
                                            src={product.images[0].url}
                                            alt={product.name}
                                            fill
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                            className="object-cover transition duration-500 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center">
                                            <Pizza size={55} className="text-gray-300" />
                                        </div>
                                    )}

                                    {product.isFeatured && (
                                        <span className="absolute left-3 top-3 rounded-full bg-[#F4A62A] px-3 py-1 text-xs font-bold text-black">
                                            Featured
                                        </span>
                                    )}
                                </div>

                                <div className="p-5">
                                    <p className="text-xs font-bold uppercase tracking-wider text-[#E94B35]">
                                        {product.category.name}
                                    </p>

                                    <h3 className="mt-2 text-xl font-extrabold text-[#171717]">
                                        {product.name}
                                    </h3>

                                    <p className="mt-2 line-clamp-2 min-h-10 text-sm text-gray-500">
                                        {product.description}
                                    </p>

                                    <div className="mt-5 flex items-center justify-between">
                                        <div>
                                            <span className="text-xs text-gray-400">
                                                Starting from
                                            </span>
                                            <p className="text-xl font-extrabold text-[#E94B35]">
                                                Rs. {Number(product.price).toLocaleString("en-PK")}
                                            </p>
                                        </div>

                                        <Link
                                            href={`/menu/${product.slug}`}
                                            className="flex h-11 w-11 items-center justify-center rounded-full bg-[#E94B35] text-white transition hover:bg-[#171717]"
                                            aria-label={`View ${product.name}`}
                                        >
                                            <Plus size={22} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}