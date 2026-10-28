export type Partner = {
  name: string;
  website?: string;
  logo?: {
    src: string;
    width: number;
    height: number;
  };
};

// Names follow the supplied client list. Only confirmed websites and logos are included.
// Asset sources and unresolved identities are recorded in docs/partners-media.md.
export const PARTNERS: readonly Partner[] = [
  { name: "Mashfiq Construction" },
  {
    name: "Sena Kalyan Sangstha",
    website: "https://senakalyan.org/",
    logo: { src: "/images/partners/sena-kalyan-sangstha.png", width: 100, height: 100 },
  },
  {
    name: "Bangladesh Air Force",
    website: "https://baf.mil.bd/",
    logo: { src: "/images/partners/bangladesh-air-force.png", width: 250, height: 314 },
  },
  {
    name: "BAFWWA",
    logo: { src: "/images/partners/bafwwa.png", width: 686, height: 386 },
  },
  { name: "SHANTA ENTERPRISE" },
  {
    name: "Bangladesh Military Academy",
    website: "https://bma.army.mil.bd/",
    logo: { src: "/images/partners/bangladesh-military-academy.png", width: 192, height: 192 },
  },
  { name: "Reliance Tech Inc." },
  { name: "NRIS" },
  { name: "Oporajita" },
];
