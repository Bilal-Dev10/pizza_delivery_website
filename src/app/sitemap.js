
// export default function sitemap() {
//     const baseUrl = "https://www.yourdomain.com";

//     const routes = [
//         "",
//         "/about",
//         "/contact",
//         "/menu",
//         "/terms",
//         "/privacy",
//     ];

//     return routes.map((route) => ({
//         url: `${baseUrl}${route}`,
//         lastModified: new Date(),
//         changeFrequency: "weekly",
//         priority: route === "" ? 1 : 0.8,
//     }));
// }



import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

export default async function sitemap() {
    const baseUrl = "https://www.yourdomain.com";

    const staticRoutes = [
        "",
        "/about",
        "/contact",
        "/menu",
        "/terms",
        "/privacy",
    ];

    const staticPages = staticRoutes.map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: route === "" ? 1 : 0.8,
    }));

    try {
        await connectDB();

        const products = await Product.find({
            isAvailable: true,
        })
            .select("slug updatedAt")
            .lean();

        const productPages = products.map((product) => ({
            url: `${baseUrl}/menu/${product.slug}`,
            lastModified: product.updatedAt || new Date(),
            changeFrequency: "weekly",
            priority: 0.7,
        }));

        return [...staticPages, ...productPages];
    } catch (error) {
        console.error("Sitemap generation error:", error);
        return staticPages;
    }
}
