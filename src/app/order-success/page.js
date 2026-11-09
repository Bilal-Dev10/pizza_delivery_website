
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Package, ShoppingBag, Home } from "lucide-react";
import { Suspense } from "react";

function OrderSuccessContent() {
    const searchParams = useSearchParams();
    const orderNumber = searchParams.get("orderNumber");

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchOrder() {
            if (!orderNumber) {
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(
                    `/api/orders/${encodeURIComponent(orderNumber)}`
                );

                const data = await response.json();

                if (response.ok && data.success) {
                    setOrder(data.order);
                }
            } catch (error) {
                console.error("Order fetch error:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchOrder();
    }, [orderNumber]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#FFF8EF]">
                Loading your order...
            </div>
        );
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#FFF8EF] px-5 py-12">
            <div className="w-full max-w-xl rounded-3xl bg-white p-8 text-center shadow-sm md:p-12">

                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle size={48} className="text-green-600" />
                </div>

                <h1 className="mt-7 text-3xl font-extrabold text-[#171717]">
                    Thank You!
                </h1>

                <h2 className="mt-2 text-xl font-bold text-[#E94B35]">
                    Your Order Has Been Placed
                </h2>

                <p className="mt-4 leading-7 text-gray-500">
                    Your delicious pizza order has been received.
                    Our team will prepare it shortly.
                </p>

                {order && (
                    <div className="mt-8 rounded-2xl bg-[#FFF8EF] p-6 text-left">
                        <div className="flex items-center justify-between gap-3">
                            <span className="text-gray-500">
                                Order Number
                            </span>
                            <span className="font-extrabold text-[#171717]">
                                {order.orderNumber}
                            </span>
                        </div>

                        <div className="mt-5 flex items-center justify-between">
                            <span className="text-gray-500">
                                Total Amount
                            </span>
                            <span className="text-xl font-extrabold text-[#E94B35]">
                                Rs. {Number(order.totalAmount).toLocaleString("en-PK")}
                            </span>
                        </div>

                        <div className="mt-5 flex items-center justify-between">
                            <span className="text-gray-500">
                                Payment
                            </span>
                            <span className="font-semibold text-[#171717]">
                                Cash on Delivery
                            </span>
                        </div>

                        <div className="mt-5 flex items-center justify-between">
                            <span className="text-gray-500">
                                Order Status
                            </span>
                            <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-bold text-yellow-700">
                                {order.status}
                            </span>
                        </div>
                    </div>
                )}

                {!order && (
                    <div className="mt-7 rounded-xl bg-yellow-50 p-4 text-sm text-yellow-800">
                        Your order was submitted, but its details could not
                        be loaded. You can check your order history after logging in.
                        {orderNumber && (
                            <p className="mt-2 font-bold">
                                Order: {orderNumber}
                            </p>
                        )}
                    </div>
                )}

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                    <Link
                        href="/orders"
                        className="flex items-center justify-center gap-2 rounded-xl bg-[#E94B35] py-3 font-bold text-white transition hover:bg-[#171717]"
                    >
                        <Package size={19} />
                        My Orders
                    </Link>

                    <Link
                        href="/menu"
                        className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 py-3 font-bold text-[#171717] transition hover:border-[#E94B35] hover:text-[#E94B35]"
                    >
                        <ShoppingBag size={19} />
                        Order More
                    </Link>
                </div>

                <Link
                    href="/"
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#E94B35]"
                >
                    <Home size={17} />
                    Back to Home
                </Link>
            </div>
        </main>
    );
}

export default function OrderSuccessPage() {
    return (
        <Suspense
            fallback={
                <div className="flex min-h-screen items-center justify-center bg-[#FFF8EF]">
                    Loading...
                </div>
            }
        >
            <OrderSuccessContent />
        </Suspense>
    );
}
