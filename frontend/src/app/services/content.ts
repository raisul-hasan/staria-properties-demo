import { useEffect, useState } from "react";
import type { ApiList, MediaLink } from "./api";

export function useApiList<T>(loader: () => Promise<ApiList<T>>, dependencies: unknown[] = []) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    loader()
      .then((response) => {
        if (!active) return;
        setItems(response.items);
        setError(null);
      })
      .catch((caught: unknown) => {
        if (!active) return;
        setError(caught instanceof Error ? caught.message : "Content could not be loaded.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
    // Callers control refresh dependencies; loader functions are intentionally inline-friendly.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return { items, loading, error };
}

export function primaryImage(media: MediaLink[] | undefined, fallback: string) {
  return (
    media?.find((item) => item.role === "PRIMARY" || item.role === "COVER" || item.role === "THUMBNAIL")?.media.secureUrl ??
    media?.[0]?.media.secureUrl ??
    fallback
  );
}

export function displayLocation(address?: { line1: string; city: string } | null) {
  return address ? `${address.line1}, ${address.city}` : "Bangladesh";
}

export function displayPrice(priceLabel: string | null | undefined, price: string | number | null | undefined, currency = "BDT") {
  if (priceLabel) return priceLabel;
  if (price === null || price === undefined) return "Price on request";
  return `${currency} ${Number(price).toLocaleString("en-BD")}`;
}
