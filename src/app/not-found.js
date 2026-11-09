
import Link from "next/link";
import { Pizza, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
    return (
        <main className="min-h-[75vh] bg-[#FFF8EF] flex items-center justify-center px-4 py-16">
            <div className="max-w-xl text-center">

                <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-8">
                    <Pizza size={48} className="text-[#E94B35]" />
                </div>

                <h1 className="text-8xl font-extrabold text-[#E94B35]">
                    404
                </h1>

                <h2 className="text-3xl font-extrabold text-[#171717] mt-5">
                    Oops! Pizza Not Found
                </h2>

                <p className="text-gray-600 leading-7 mt-4">
                    Sorry, the page you are looking for does not exist
                    or may have been moved. Let's get you back to something delicious!
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">

                    <Link
                        href="/"
                        className="flex items-center justify-center gap-2 bg-[#E94B35] text-white px-7 py-3 rounded-xl font-bold hover:bg-[#171717] transition"
                    >
                        <Home size={19} />
                        Back to Home
                    </Link>

                    <Link
                        href="/menu"
                        className="flex items-center justify-center gap-2 border border-[#171717] text-[#171717] px-7 py-3 rounded-xl font-bold hover:bg-[#171717] hover:text-white transition"
                    >
                        <ArrowLeft size={19} />
                        Explore Menu
                    </Link>

                </div>
            </div>
        </main>
    );
}
