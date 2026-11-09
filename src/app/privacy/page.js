
import Link from "next/link";
import {
    ShieldCheck,
    User,
    Database,
    Lock,
    Eye,
    Mail,
} from "lucide-react";

export default function PrivacyPage() {
    const sections = [
        {
            icon: User,
            title: "1. Information We Collect",
            content: [
                "Name and email address when you register or contact us.",
                "Phone number and delivery address when you place an order.",
                "Order details, including products, quantities, prices, and delivery information.",
                "Messages submitted through our Contact Us form.",
            ],
        },
        {
            icon: Database,
            title: "2. How We Use Your Information",
            content: [
                "To create and manage your customer account.",
                "To process and deliver your orders.",
                "To contact you about order updates and customer support.",
                "To improve our website and services.",
            ],
        },
        {
            icon: Lock,
            title: "3. How We Protect Your Information",
            content: [
                "We use reasonable security measures to protect stored customer information.",
                "Passwords are stored using secure password hashing.",
                "Access to administrative information is restricted to authorized administrators.",
                "No online system can guarantee complete security.",
            ],
        },
        {
            icon: Eye,
            title: "4. Sharing of Information",
            content: [
                "We do not sell customer personal information.",
                "Information may be used by authorized staff to process and deliver orders.",
                "Information may be disclosed when required by applicable law.",
            ],
        },
        {
            icon: ShieldCheck,
            title: "5. Cookies and Account Security",
            content: [
                "Our website uses authentication cookies to keep customers logged in.",
                "Some website features may use browser storage to remember shopping cart items.",
                "Customers should keep their login information private.",
            ],
        },
    ];

    return (
        <main className="bg-[#FFF8EF] min-h-screen">

            {/* Header */}
            <section className="bg-[#171717] py-20 px-4 text-center">
                <ShieldCheck size={44} className="text-[#E94B35] mx-auto" />

                <h1 className="text-4xl sm:text-5xl font-extrabold text-white mt-5">
                    Privacy <span className="text-[#E94B35]">Policy</span>
                </h1>

                <p className="text-gray-300 max-w-2xl mx-auto mt-5 leading-7">
                    Your privacy matters to us. Learn how Pizza House
                    collects, uses, and protects your information.
                </p>
            </section>

            {/* Policy Content */}
            <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16">

                <div className="bg-white rounded-2xl p-6 sm:p-10 shadow-sm">

                    <p className="text-gray-600 leading-8">
                        Pizza House respects your privacy. This policy explains
                        what information we collect when you use our website
                        and how we use it to provide our services.
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

                    {/* Customer Rights */}
                    <div className="border-t border-gray-100 mt-10 pt-8">
                        <h2 className="text-xl font-extrabold text-[#171717]">
                            6. Your Information
                        </h2>

                        <p className="text-gray-600 leading-8 mt-3">
                            You can update your profile information through
                            your account. For questions or requests about
                            your personal information, contact our team.
                        </p>

                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 bg-[#E94B35] text-white px-6 py-3 rounded-xl font-bold mt-5 hover:bg-[#171717] transition"
                        >
                            <Mail size={18} />
                            Contact Us
                        </Link>
                    </div>

                    {/* Policy Updates */}
                    <div className="border-t border-gray-100 mt-8 pt-8">
                        <h2 className="text-xl font-extrabold text-[#171717]">
                            7. Changes to This Policy
                        </h2>

                        <p className="text-gray-600 leading-8 mt-3">
                            We may update this Privacy Policy when our
                            services or practices change. Any updates
                            will be published on this page.
                        </p>
                    </div>

                </div>

                <p className="text-center text-sm text-gray-400 mt-8">
                    Thank you for trusting Pizza House.
                </p>

            </section>
        </main>
    );
}
