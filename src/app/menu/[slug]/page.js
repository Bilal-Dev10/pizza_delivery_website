"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Minus, Plus, ShoppingCart, Pizza } from "lucide-react";
import toast from "react-hot-toast";

export default function PizzaDetailsPage() {
    const params = useParams();
    const router = useRouter();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedToppings, setSelectedToppings] = useState([]);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        async function fetchProduct() {
            try {
                const response = await fetch(
                    `/api/products/${params.slug}`
                );

                const data = await response.json();

                if (!response.ok || !data.success) {
                    toast.error("Pizza not found");
                    router.push("/menu");
                    return;
                }

                setProduct(data.product);

                if (data.product.sizes?.length > 0) {
                    setSelectedSize(data.product.sizes[0].name);
                }
            } catch (error) {
                console.error(error);
                toast.error("Unable to load pizza");
            } finally {
                setLoading(false);
            }
        }

        if (params.slug) {
            fetchProduct();
        }
    }, [params.slug, router]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#FFF8EF]">
                <p className="text-lg font-semibold text-gray-600">
                    Loading pizza...
                </p>
            </div>
        );
    }

    if (!product) return null;

    const currentSize = product.sizes?.find(
        (size) => size.name === selectedSize
    );

    const basePrice = currentSize
        ? currentSize.price
        : product.price;

    const toppingsPrice = selectedToppings.reduce(
        (total, topping) => total + topping.price,
        0
    );

    const unitPrice = basePrice + toppingsPrice;
    const totalPrice = unitPrice * quantity;

    function handleToppingChange(topping) {
        setSelectedToppings((previous) => {
            const exists = previous.some(
                (item) => item.name === topping.name
            );

            if (exists) {
                return previous.filter(
                    (item) => item.name !== topping.name
                );
            }

            return [...previous, topping];
        });
    }

    function handleAddToCart() {
        try {
            const existingCart = JSON.parse(
                localStorage.getItem("pizza-cart") || "[]"
            );

            const cartItem = {
                product: product._id,
                name: product.name,
                slug: product.slug,
                image: product.images?.[0]?.url || "",
                size: selectedSize || "Regular",
                toppings: selectedToppings,
                quantity,
                price: unitPrice,
            };

            const updatedCart = [...existingCart, cartItem];

            localStorage.setItem(
                "pizza-cart",
                JSON.stringify(updatedCart)
            );

            toast.success("Pizza added to cart!");
        } catch (error) {
            console.error("Add to cart error:", error);
            toast.error("Could not add pizza to cart");
        }
    }

    return (
        <main className="min-h-screen bg-[#FFF8EF] px-5 py-10">
            <div className="mx-auto max-w-6xl">

                <Link
                    href="/menu"
                    className="mb-8 inline-flex items-center gap-2 font-semibold text-gray-600 hover:text-[#E94B35]"
                >
                    <ArrowLeft size={19} />
                    Back to Menu
                </Link>

                <div className="grid gap-10 rounded-3xl bg-white p-5 shadow-sm md:grid-cols-2 md:p-9">

                    {/* Pizza Image */}
                    <div className="relative min-h-[300px] overflow-hidden rounded-2xl bg-gray-100 md:min-h-[480px]">
                        {product.images?.[0]?.url ? (
                            <Image
                                src={product.images[0].url}
                                alt={product.name}
                                fill
                                priority
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="object-cover"
                            />
                        ) : (
                            <div className="flex h-full items-center justify-center">
                                <Pizza size={80} className="text-gray-300" />
                            </div>
                        )}
                    </div>

                    {/* Pizza Information */}
                    <div className="py-3">
                        <p className="font-bold uppercase tracking-wider text-[#E94B35]">
                            {product.category?.name}
                        </p>

                        <h1 className="mt-3 text-3xl font-extrabold text-[#171717] md:text-4xl">
                            {product.name}
                        </h1>

                        <p className="mt-4 leading-7 text-gray-500">
                            {product.description}
                        </p>

                        <div className="my-6 border-t border-gray-100" />

                        {/* Size Selection */}
                        {product.sizes?.length > 0 && (
                            <div>
                                <h3 className="mb-3 font-bold text-[#171717]">
                                    Choose Your Size
                                </h3>

                                <div className="flex flex-wrap gap-3">
                                    {product.sizes.map((size) => (
                                        <button
                                            key={size.name}
                                            onClick={() => setSelectedSize(size.name)}
                                            className={`rounded-xl border px-5 py-3 text-left transition ${selectedSize === size.name
                                                    ? "border-[#E94B35] bg-[#E94B35] text-white"
                                                    : "border-gray-200 text-gray-700 hover:border-[#E94B35]"
                                                }`}
                                        >
                                            <span className="block font-bold">
                                                {size.name}
                                            </span>
                                            <span className="text-sm">
                                                Rs. {size.price.toLocaleString("en-PK")}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Toppings */}
                        {product.toppings?.length > 0 && (
                            <div className="mt-7">
                                <h3 className="mb-3 font-bold text-[#171717]">
                                    Extra Toppings
                                </h3>

                                <div className="space-y-3">
                                    {product.toppings.map((topping) => {
                                        const checked = selectedToppings.some(
                                            (item) => item.name === topping.name
                                        );

                                        return (
                                            <label
                                                key={topping.name}
                                                className="flex cursor-pointer items-center justify-between rounded-xl border border-gray-200 p-3 hover:border-[#E94B35]"
                                            >
                                                <span className="flex items-center gap-3">
                                                    <input
                                                        type="checkbox"
                                                        checked={checked}
                                                        onChange={() =>
                                                            handleToppingChange(topping)
                                                        }
                                                        className="h-4 w-4 accent-[#E94B35]"
                                                    />
                                                    <span className="font-medium text-gray-700">
                                                        {topping.name}
                                                    </span>
                                                </span>

                                                <span className="font-semibold text-[#E94B35]">
                                                    + Rs. {topping.price}
                                                </span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Quantity */}
                        <div className="mt-7">
                            <h3 className="mb-3 font-bold text-[#171717]">
                                Quantity
                            </h3>

                            <div className="flex w-fit items-center gap-5 rounded-xl border border-gray-200 px-4 py-2">
                                <button
                                    onClick={() =>
                                        setQuantity((previous) =>
                                            Math.max(1, previous - 1)
                                        )
                                    }
                                    aria-label="Decrease quantity"
                                >
                                    <Minus size={18} />
                                </button>

                                <span className="min-w-5 text-center font-bold">
                                    {quantity}
                                </span>

                                <button
                                    onClick={() =>
                                        setQuantity((previous) =>
                                            Math.min(20, previous + 1)
                                        )
                                    }
                                    aria-label="Increase quantity"
                                >
                                    <Plus size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Total and Add to Cart */}
                        <div className="mt-8 border-t border-gray-100 pt-6">
                            <div className="mb-5 flex items-center justify-between">
                                <span className="font-semibold text-gray-600">
                                    Total Price
                                </span>

                                <span className="text-2xl font-extrabold text-[#E94B35]">
                                    Rs. {totalPrice.toLocaleString("en-PK")}
                                </span>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#E94B35] py-4 font-bold text-white transition hover:bg-[#171717]"
                            >
                                <ShoppingCart size={21} />
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}