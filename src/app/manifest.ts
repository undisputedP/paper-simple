import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PaperSimple — Research Papers Made Simple",
    short_name: "PaperSimple",
    description:
      "Upload any research paper and get it explained like you're 15. Free for students.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#7c3aed",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
