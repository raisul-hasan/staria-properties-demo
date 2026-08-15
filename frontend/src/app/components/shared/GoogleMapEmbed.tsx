interface GoogleMapEmbedProps {
  query: string;
  title: string;
  zoom?: number;
}

export function GoogleMapEmbed({ query, title, zoom = 17 }: GoogleMapEmbedProps) {
  const fallbackParams = new URLSearchParams({
    q: query,
    z: String(zoom),
    output: "embed",
  });
  const publicEmbedUrl = `https://www.google.com/maps?${fallbackParams.toString()}`;

  return (
    <iframe
      title={title}
      src={publicEmbedUrl}
      className="absolute inset-0 h-full w-full border-0"
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      allowFullScreen
    />
  );
}
