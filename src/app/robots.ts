import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://cookbook-taste-the-magic.vercel.app"; // Fallback URL or read from headers if dynamic
  
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/admin", // Strictly block search indexing of the admin panel
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
