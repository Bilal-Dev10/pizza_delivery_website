
import Link from "next/link";
import Image from "next/image";
import {
    Heart,
    Target,
    Award,
    Pizza,
    Truck,
    ShieldCheck,
    ArrowRight,
} from "lucide-react";

export default function AboutPage() {
    return (
        <main className="bg-[#FFF8EF]">

            {/* Hero Section */}
            <section className="bg-[#171717] py-20 px-4 text-center">
                <p className="text-[#F4A62A] font-bold tracking-widest text-sm">
                    GET TO KNOW US
                </p>

                <h1 className="text-4xl sm:text-5xl font-extrabold text-white mt-4">
                    About <span className="text-[#E94B35]">Pizza House</span>
                </h1>

                <p className="text-gray-300 max-w-2xl mx-auto mt-5 leading-8">
                    We believe great pizza brings people together.
                    Our goal is to serve delicious food and create
                    memorable moments with every order.
                </p>
            </section>

            {/* Our Story */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

                    <div className="relative h-[350px] sm:h-[480px] rounded-3xl overflow-hidden">
                        <Image
                            src="https://images.unsplash.com/photo-1579751626657-72bc17010498?w=1000"
                            alt="Fresh pizza prepared in a restaurant"
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover"
                        />
                    </div>

                    <div>
                        <p className="text-[#E94B35] font-bold tracking-widest text-sm">
                            OUR STORY
                        </p>

                        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#171717] mt-3 leading-tight">
                            Serving Happiness, One Pizza at a Time
                        </h2>

                        <p className="text-gray-600 leading-8 mt-6">
                            Welcome to Pizza House! We are passionate about
                            delicious pizza, fresh ingredients, and great taste.
                            We want every customer to enjoy a satisfying meal
                            with family and friends.
                        </p>

                        <p className="text-gray-600 leading-8 mt-4">
                            From choosing quality ingredients to preparing
                            every order with care, we focus on making your
                            pizza experience enjoyable.
                        </p>

                        <Link
                            href="/menu"
                            className="inline-flex items-center gap-2 bg-[#E94B35] text-white px-7 py-4 rounded-xl font-bold mt-8 hover:bg-[#171717] transition"
                        >
                            Explore Our Menu
                            <ArrowRight size={19} />
                        </Link>
                    </div>

                </div>
            </section>

            {/* Mission and Vision */}
            <section className="bg-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="text-center mb-12">
                        <p className="text-[#E94B35] font-bold tracking-widest text-sm">
                            WHAT DRIVES US
                        </p>

                        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#171717] mt-3">
                            Our Mission & Vision
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                        <div className="bg-[#FFF8EF] rounded-2xl p-8 sm:p-10">
                            <div className="w-14 h-14 rounded-xl bg-[#E94B35] text-white flex items-center justify-center">
                                <Target size={28} />
                            </div>

                            <h3 className="text-2xl font-extrabold text-[#171717] mt-6">
                                Our Mission
                            </h3>

                            <p className="text-gray-600 leading-8 mt-4">
                                Our mission is to serve fresh, delicious, and
                                quality pizzas while providing friendly service
                                and a satisfying experience to every customer.
                            </p>
                        </div>

                        <div className="bg-[#FFF8EF] rounded-2xl p-8 sm:p-10">
                            <div className="w-14 h-14 rounded-xl bg-[#F4A62A] text-[#171717] flex items-center justify-center">
                                <Award size={28} />
                            </div>

                            <h3 className="text-2xl font-extrabold text-[#171717] mt-6">
                                Our Vision
                            </h3>

                            <p className="text-gray-600 leading-8 mt-4">
                                Our vision is to become a trusted pizza
                                destination where people can enjoy great taste,
                                reliable service, and happy moments together.
                            </p>
                        </div>

                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

                <div className="text-center mb-12">
                    <p className="text-[#E94B35] font-bold tracking-widest text-sm">
                        WHY PIZZA HOUSE
                    </p>

                    <h2 className="text-3xl sm:text-4xl font-extrabold text-[#171717] mt-3">
                        Why Customers Choose Us
                    </h2>

                    <p className="text-gray-500 mt-4 max-w-xl mx-auto">
                        We work hard to make every order special.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">

                    <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
                        <div className="w-16 h-16 bg-orange-100 text-[#E94B35] rounded-2xl flex items-center justify-center mx-auto">
                            <Pizza size={30} />
                        </div>

                        <h3 className="text-xl font-bold text-[#171717] mt-5">
                            Delicious Food
                        </h3>

                        <p className="text-gray-500 mt-3 leading-7">
                            Enjoy tasty pizzas prepared with care and
                            quality ingredients.
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
                        <div className="w-16 h-16 bg-yellow-100 text-[#E94B35] rounded-2xl flex items-center justify-center mx-auto">
                            <Truck size={30} />
                        </div>

                        <h3 className="text-xl font-bold text-[#171717] mt-5">
                            Convenient Delivery
                        </h3>

                        <p className="text-gray-500 mt-3 leading-7">
                            Order online and enjoy your favorite pizza
                            at home.
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mx-auto">
                            <ShieldCheck size={30} />
                        </div>

                        <h3 className="text-xl font-bold text-[#171717] mt-5">
                            Quality Service
                        </h3>

                        <p className="text-gray-500 mt-3 leading-7">
                            We care about customer satisfaction and
                            a great ordering experience.
                        </p>
                    </div>

                </div>
            </section>

            {/* Final CTA */}
            <section className="bg-[#171717] py-20 px-4 text-center">
                <Heart size={38} className="text-[#E94B35] mx-auto" />

                <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-6">
                    Made with Love, Served with Taste!
                </h2>

                <p className="text-gray-400 mt-4 max-w-xl mx-auto leading-7">
                    Ready to enjoy something delicious? Explore our menu
                    and order your favorite pizza today.
                </p>

                <Link
                    href="/menu"
                    className="inline-flex items-center gap-2 bg-[#E94B35] text-white px-8 py-4 rounded-xl font-bold mt-8 hover:bg-[#F4A62A] hover:text-[#171717] transition"
                >
                    Order Now
                    <ArrowRight size={20} />
                </Link>
            </section>

        </main>
    );
}
