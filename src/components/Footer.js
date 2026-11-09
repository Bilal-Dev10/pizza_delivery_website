
// import Link from "next/link";
// import {
//     Pizza,
//     MapPin,
//     Phone,
//     Mail,
//     Clock,
// } from "lucide-react";

// export default function Footer() {
//     return (
//         <footer className="bg-[#171717] text-white">
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">

//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

//                     {/* Brand */}
//                     <div>
//                         <Link href="/" className="flex items-center gap-3 mb-5">
//                             <div className="w-11 h-11 rounded-xl bg-[#E94B35] flex items-center justify-center">
//                                 <Pizza size={26} />
//                             </div>

//                             <h2 className="text-2xl font-extrabold">
//                                 Pizza <span className="text-[#E94B35]">House</span>
//                             </h2>
//                         </Link>

//                         <p className="text-gray-400 leading-7 text-sm">
//                             Freshly baked pizzas, delicious flavors, and quality
//                             ingredients. Order your favorite pizza and enjoy it
//                             at home.
//                         </p>

//                         {/* Social Links */}
//                         <div className="flex items-center gap-4 mt-6">
//                             <a
//                                 href="#"
//                                 aria-label="Facebook"
//                                 className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#E94B35] transition font-bold"
//                             >
//                                 f
//                             </a>

//                             <a
//                                 href="#"
//                                 aria-label="Instagram"
//                                 className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#E94B35] transition font-bold"
//                             >
//                                 IG
//                             </a>
//                         </div>
//                     </div>

//                     {/* Quick Links */}
//                     <div>
//                         <h3 className="text-lg font-bold mb-6">
//                             Quick Links
//                         </h3>

//                         <ul className="space-y-4 text-sm text-gray-400">
//                             <li>
//                                 <Link href="/" className="hover:text-[#E94B35] transition">
//                                     Home
//                                 </Link>
//                             </li>
//                             <li>
//                                 <Link href="/menu" className="hover:text-[#E94B35] transition">
//                                     Our Menu
//                                 </Link>
//                             </li>
//                             <li>
//                                 <Link href="/cart" className="hover:text-[#E94B35] transition">
//                                     Shopping Cart
//                                 </Link>
//                             </li>
//                             <li>
//                                 <Link href="/orders" className="hover:text-[#E94B35] transition">
//                                     My Orders
//                                 </Link>
//                             </li>
//                             <li>
//                                 <Link href="/profile" className="hover:text-[#E94B35] transition">
//                                     My Account
//                                 </Link>
//                             </li>
//                         </ul>
//                     </div>

//                     {/* Contact */}
//                     <div>
//                         <h3 className="text-lg font-bold mb-6">
//                             Contact Us
//                         </h3>

//                         <ul className="space-y-5 text-sm text-gray-400">
//                             <li className="flex items-start gap-3">
//                                 <MapPin size={19} className="text-[#E94B35] shrink-0" />
//                                 <span>Your restaurant address here</span>
//                             </li>

//                             <li className="flex items-center gap-3">
//                                 <Phone size={19} className="text-[#E94B35] shrink-0" />
//                                 <span>+92 300 0000000</span>
//                             </li>

//                             <li className="flex items-center gap-3">
//                                 <Mail size={19} className="text-[#E94B35] shrink-0" />
//                                 <span>info@pizzahouse.com</span>
//                             </li>
//                         </ul>
//                     </div>

//                     {/* Opening Hours */}
//                     <div>
//                         <h3 className="text-lg font-bold mb-6">
//                             Opening Hours
//                         </h3>

//                         <div className="flex items-start gap-3 text-gray-400 text-sm">
//                             <Clock size={20} className="text-[#E94B35] shrink-0" />

//                             <div className="space-y-3">
//                                 <p>Monday - Sunday</p>
//                                 <p className="text-white font-semibold">
//                                     12:00 PM - 12:00 AM
//                                 </p>
//                                 <p className="text-xs">
//                                     Please confirm actual restaurant hours.
//                                 </p>
//                             </div>
//                         </div>
//                     </div>

//                 </div>

//                 {/* Bottom */}
//                 <div className="border-t border-white/10 mt-12 pt-7 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
//                     <p>
//                         © {new Date().getFullYear()} Pizza House. All rights reserved.
//                     </p>

//                     <p>
//                         Made with ❤️ for pizza lovers.
//                     </p>
//                 </div>

//             </div>
//         </footer>
//     );
// }


import Link from "next/link";
import {
    Pizza,
    MapPin,
    Phone,
    Mail,
    Clock,
} from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-[#171717] text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

                    {/* Brand */}
                    <div>
                        <Link href="/" className="flex items-center gap-3 mb-5">
                            <div className="w-11 h-11 rounded-xl bg-[#E94B35] flex items-center justify-center">
                                <Pizza size={26} />
                            </div>

                            <h2 className="text-2xl font-extrabold">
                                Pizza <span className="text-[#E94B35]">House</span>
                            </h2>
                        </Link>

                        <p className="text-gray-400 leading-7 text-sm">
                            Freshly baked pizzas, delicious flavors, and quality
                            ingredients. Order your favorite pizza and enjoy it
                            at home.
                        </p>

                        {/* Social Links */}
                        <div className="flex items-center gap-4 mt-6">
                            <a
                                href="#"
                                aria-label="Facebook"
                                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#E94B35] transition font-bold"
                            >
                                f
                            </a>

                            <a
                                href="#"
                                aria-label="Instagram"
                                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#E94B35] transition font-bold"
                            >
                                IG
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold mb-6">
                            Quick Links
                        </h3>

                        <ul className="space-y-4 text-sm text-gray-400">
                            <li>
                                <Link href="/" className="hover:text-[#E94B35] transition">
                                    Home
                                </Link>
                            </li>

                            {/* <li>
                                <Link href="/menu" className="hover:text-[#E94B35] transition">
                                    Our Menu
                                </Link>
                            </li> */}

                            {/* <li>
                                <Link href="/cart" className="hover:text-[#E94B35] transition">
                                    Shopping Cart
                                </Link>
                            </li> */}

                            {/* <li>
                                <Link href="/orders" className="hover:text-[#E94B35] transition">
                                    My Orders
                                </Link>
                            </li> */}

                            {/* <li>
                                <Link href="/profile" className="hover:text-[#E94B35] transition">
                                    My Account
                                </Link>
                            </li> */}

                            <li>
                                <Link href="/about" className="hover:text-[#E94B35] transition">
                                    About Us
                                </Link>
                            </li>

                            <li>
                                <Link href="/contact" className="hover:text-[#E94B35] transition">
                                    Contact Us
                                </Link>
                            </li>

                            <li>
                                <Link href="/terms" className="hover:text-[#E94B35] transition">
                                    Terms & Conditions
                                </Link>
                            </li>

                            <li>
                                <Link href="/privacy" className="hover:text-[#E94B35] transition">
                                    Privacy Policy
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-lg font-bold mb-6">
                            Contact Us
                        </h3>

                        <ul className="space-y-5 text-sm text-gray-400">
                            <li className="flex items-start gap-3">
                                <MapPin size={19} className="text-[#E94B35] shrink-0" />
                                <span>Your restaurant address here</span>
                            </li>

                            <li className="flex items-center gap-3">
                                <Phone size={19} className="text-[#E94B35] shrink-0" />
                                <span>+92 300 0000000</span>
                            </li>

                            <li className="flex items-center gap-3">
                                <Mail size={19} className="text-[#E94B35] shrink-0" />
                                <span>info@pizzahouse.com</span>
                            </li>
                        </ul>
                    </div>

                    {/* Opening Hours */}
                    <div>
                        <h3 className="text-lg font-bold mb-6">
                            Opening Hours
                        </h3>

                        <div className="flex items-start gap-3 text-gray-400 text-sm">
                            <Clock size={20} className="text-[#E94B35] shrink-0" />

                            <div className="space-y-3">
                                <p>Monday - Sunday</p>

                                <p className="text-white font-semibold">
                                    12:00 PM - 12:00 AM
                                </p>

                                <p className="text-xs">
                                    Please confirm actual restaurant hours.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Bottom */}
                <div className="border-t border-white/10 mt-12 pt-7 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
                    <p>
                        © {new Date().getFullYear()} Pizza House. All rights reserved.
                    </p>

                    <p>
                        Made with ❤️ for pizza lovers.
                    </p>
                </div>

            </div>
        </footer>
    );
}
