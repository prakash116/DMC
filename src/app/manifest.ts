import type { MetadataRoute } from "next";

// Web app manifest: makes the site installable as a home-screen app on Android, iOS and desktop
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "The Detailing Monk",
    short_name: "Detailing Monk",
    description:
      "Car detailing studio in Sector 11, Rohini: foam wash, interior dry cleaning, polishing, ceramic coating & PPF.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#faf6ef",
    theme_color: "#722f37",
    categories: ["lifestyle", "shopping"],
    icons: [
      { src: "/logo/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/logo/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      // logo inside the 80% safe zone so Android's circle/squircle mask doesn't crop it
      { src: "/logo/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
