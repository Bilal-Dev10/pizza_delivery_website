
export default function robots() {
    const baseUrl = "https://www.yourdomain.com";

    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: [
                "/admin/",
                "/api/",
                "/profile/",
                "/checkout/",
                "/orders/",
            ],
        },

        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
