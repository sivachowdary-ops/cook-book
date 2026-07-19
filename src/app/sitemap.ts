import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://cookbook-taste-the-magic.vercel.app";
  const currentDate = new Date();

  const routes = ["", "/shop", "/about", "/how-to-order", "/contact"];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: currentDate,
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));
}
