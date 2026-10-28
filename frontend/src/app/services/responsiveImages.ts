import sources from "./imageSources.json";

type ImageSource = { src: string; srcSet: string; width: number; height: number };
const localSources: Record<string, ImageSource | undefined> = sources;

export function responsiveImage(src: string | undefined): ImageSource | undefined {
  if (!src) return undefined;
  if (localSources[src]) return localSources[src];
  if (!src.startsWith("https://images.unsplash.com/")) return undefined;

  const original = new URL(src);
  const width = Number(original.searchParams.get("w")) || 1600;
  const height = Number(original.searchParams.get("h")) || 0;
  const maxWidth = Math.min(width, 1920);
  const widths = [...new Set([480, 960, 1600, maxWidth].filter((value) => value <= maxWidth))].sort((a, b) => a - b);
  const imageUrl = (size: number) => {
    const url = new URL(original);
    url.searchParams.set("w", String(size));
    if (height) url.searchParams.set("h", String(Math.round(height * size / width)));
    url.searchParams.set("auto", "format");
    url.searchParams.set("q", "80");
    return url.toString();
  };

  return {
    src: imageUrl(maxWidth),
    srcSet: widths.map((size) => `${imageUrl(size)} ${size}w`).join(", "),
    width: maxWidth,
    height: height ? Math.round(height * maxWidth / width) : 0,
  };
}
