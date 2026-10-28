import type { ImgHTMLAttributes } from "react";
import { responsiveImage } from "../../services/responsiveImages";

type SiteImageProps = ImgHTMLAttributes<HTMLImageElement> & { priority?: boolean };

export function SiteImage({ src, alt = "", priority = false, loading, decoding = "async", srcSet, sizes, fetchPriority, ...props }: SiteImageProps) {
  const optimized = responsiveImage(src);
  const candidates = srcSet ?? optimized?.srcSet;
  // React 18 requires the lowercase DOM attribute for this browser hint.
  const priorityHint = priority ? "high" : fetchPriority;

  return (
    <img
      {...props}
      {...(priorityHint ? { fetchpriority: priorityHint } : {})}
      src={optimized?.src ?? src}
      alt={alt}
      width={props.width ?? optimized?.width}
      height={props.height ?? (optimized?.height || undefined)}
      srcSet={candidates}
      sizes={candidates ? sizes ?? "100vw" : sizes}
      loading={priority ? "eager" : loading ?? "lazy"}
      decoding={decoding}
    />
  );
}
