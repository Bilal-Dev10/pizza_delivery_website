// import Navbar from "@/components/Navbar";
// import "./globals.css";
// import { Toaster } from "react-hot-toast";
// import Footer from "@/components/Footer";

// export const metadata = {
//     title: "Pizza House | Fresh Pizza Delivered",
//     description:
//         "Order delicious fresh pizzas online. Enjoy hot, tasty pizza delivered to your doorstep.",
// };

// export default function RootLayout({ children }) {
//     return (
//         <html lang="en">
//             <body cz-shortcut-listen="true">
//                 <Navbar />
//                 {children}
//                 <Footer/>

//                 <Toaster
//                     position="top-right"
//                     reverseOrder={false}
//                 />
//             </body>
//         </html>
//     );
// }



import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata = {
    metadataBase: new URL("https://www.yourdomain.com"),

    title: {
        default: "Pizza House | Fresh Pizza Delivered",
        template: "%s | Pizza House",
    },

    description:
        "Order delicious fresh pizzas online from Pizza House. Explore our pizza menu and enjoy freshly prepared food delivered to your doorstep.",

    keywords: [
        "Pizza House",
        "online pizza delivery",
        "fresh pizza",
        "order pizza online",
        "pizza delivery Pakistan",
        "delicious pizza",
        "best pizza",
    ],

    authors: [{ name: "Pizza House" }],

    openGraph: {
        title: "Pizza House | Fresh Pizza Delivered",
        description:
            "Enjoy delicious, freshly prepared pizzas. Explore our menu and order online from Pizza House.",
        siteName: "Pizza House",
        type: "website",
        locale: "en_PK",
        images: [
            {
                url: "/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "Pizza House - Fresh Pizza Delivered",
            },
        ],
    },

    twitter: {
        card: "summary_large_image",
        title: "Pizza House | Fresh Pizza Delivered",
        description:
            "Order delicious fresh pizzas online from Pizza House.",
        images: ["/og-image.jpg"],
    },

    robots: {
        index: true,
        follow: true,
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <Navbar />

                {children}

                <Footer />

                <Toaster
                    position="top-right"
                    reverseOrder={false}
                />
            </body>
        </html>
    );
}
