
import Link from "next/link";
import { FileText, ShoppingBag, CreditCard, Truck, RefreshCw } from "lucide-react";

export default function TermsPage() {
    const sections = [
        {
            icon: ShoppingBag,
            title: "1. Placing Orders",
            content: [
                "Customers must provide correct contact information and delivery details when placing an order.",
                "Please review your cart carefully before confirming your order.",
                "Orders are subject to product availability and restaurant confirmation.",
            ],
        },
        {
            icon: CreditCard,
            title: "2. Prices and Payments",
            content: [
                "All prices are displayed in Pakistani Rupees (PKR).",
                "Delivery charges will be shown during checkout.",
                "Cash on Delivery (COD) is the accepted payment method for the current version of our service.",
                "The customer must pay the confirmed order amount upon delivery.",
            ],
        },
        {
            icon: Truck,
            title: "3. Delivery Policy",
            content: [
                "Delivery times are estimates and may vary depending on location, weather, and order volume.",
                "Customers should provide a complete and accurate delivery address.",
                "Please ensure someone is available to receive the order.",
            ],
        },
        {
            icon: RefreshCw,
            title: "4. Order Changes and Cancellations",
            content: [
                "Customers should contact the restaurant as soon as possible to request an order change or cancellation.",
                "Once an order has been prepared or dispatched, cancellation may not be possible.",
                "Any cancellation request is subject to restaurant confirmation.",
            ],
        },
        {
            icon: FileText,
            title: "5. Product Information",
            content: [
                "We try to display accurate product descriptions, images, and prices.",
                "Actual food presentation may vary slightly from website images.",
                "Product availability may change without prior notice.",
            ],
        },
    ];

    return (
        <main className="bg-[#FFF8EF] min-h-screen">

            {/* Header */}
            <section className="bg-[#171717] py-20 px-4 text-center">
                <FileText size={42} className="text-[#E94B35] mx-auto" />

                <h1 className="text-4xl sm:text-5xl font-extrabold text-white mt-5">
                    Terms & <span className="text-[#E94B35]">Conditions</span>
                </h1>

                <p className="text-gray-300 max-w-2xl mx-auto mt-5 leading-7">
                    Please read these terms before using Pizza House
                    and placing an order through our website.
                </p>
            </section>

            {/* Content */}
            <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16">

                <div className="bg-white rounded-2xl p-6 sm:p-10 shadow-sm">

                    <p className="text-gray-600 leading-8">
                        Welcome to Pizza House. By accessing or using our
                        website, you agree to follow the terms described
                        on this page. These terms explain the basic rules
                        for using our online ordering service.
                    </p>

                    <div className="mt-10 space-y-10">
                        {sections.map((section, index) => {
                            const Icon = section.icon;

                            return (
                                <div key={index}>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-11 h-11 rounded-xl bg-orange-100 text-[#E94B35] flex items-center justify-center shrink-0">
                                            <Icon size={23} />
                                        </div>

                                        <h2 className="text-xl font-extrabold text-[#171717]">
                                            {section.title}
                                        </h2>
                                    </div>

                                    <ul className="space-y-3 pl-4">
                                        {section.content.map((item, i) => (
                                            <li
                                                key={i}
                                                className="text-gray-600 leading-7 list-disc"
                                            >
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        })}
                    </div>

                    <div className="border-t border-gray-100 mt-10 pt-8">
                        <h2 className="text-xl font-extrabold text-[#171717]">
                            6. Changes to These Terms
                        </h2>

                        <p className="text-gray-600 leading-8 mt-3">
                            Pizza House may update these terms when needed.
                            Updated terms will be published on this page.
                            We encourage customers to review this page
                            from time to time.
                        </p>
                    </div>

                    <div className="border-t border-gray-100 mt-8 pt-8">
                        <h2 className="text-xl font-extrabold text-[#171717]">
                            7. Contact Us
                        </h2>

                        <p className="text-gray-600 leading-8 mt-3">
                            If you have questions about these terms,
                            please contact our team through our
                            Contact Us page.
                        </p>

                        <Link
                            href="/contact"
                            className="inline-flex items-center justify-center bg-[#E94B35] text-white px-6 py-3 rounded-xl font-bold mt-5 hover:bg-[#171717] transition"
                        >
                            Contact Us
                        </Link>
                    </div>

                </div>

                <p className="text-center text-sm text-gray-400 mt-8">
                    Please review these terms before placing an order.
                </p>

            </section>
        </main>
    );
}
