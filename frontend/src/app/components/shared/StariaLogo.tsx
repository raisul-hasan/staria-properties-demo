import logoWhite from "../../../assets/brand/staria-logo-white.webp";
import logoBlack from "../../../assets/brand/staria-logo-black.webp";

export function StariaLogo({ light = false }: { light?: boolean }) {
  return (
    <img
      src={light ? logoWhite : logoBlack}
      alt="Staria"
      width={512}
      height={light ? 251 : 431}
      decoding="async"
      className="block h-14 sm:h-16 w-auto max-w-full object-contain"
    />
  );
}
