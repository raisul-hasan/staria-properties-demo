import type { ImgHTMLAttributes } from "react";

import stariaLogoBlack from "@/assets/branding/staria-logo-black.png";
import stariaLogoWhite from "@/assets/branding/staria-logo-white.png";

type StariaLogoProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  light?: boolean;
};

export function StariaLogo({
  light = false,
  alt = "STARIA",
  className = "",
  ...props
}: StariaLogoProps) {
  const logo = light ? stariaLogoWhite : stariaLogoBlack;

  return (
    <img
      src={logo}
      alt={alt}
      className={`block h-12 w-auto max-w-full object-contain ${className}`.trim()}
      decoding="async"
      {...props}
    />
  );
}
