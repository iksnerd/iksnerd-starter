import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "iksnerd Starter kit",
    short_name: "iksnerd Starter kit",
    description:
      "A starter kit for building web applications with Next.js, TypeScript, and Tailwind CSS.",
    start_url: "/",
    display: "standalone",
    background_color: "#fff",
    theme_color: "#fff",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
