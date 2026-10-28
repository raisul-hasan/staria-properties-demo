import media from "./projectMedia.json";
import visualisations from "./projectVisualisations.json";

export type ProjectPhoto = { src: string; thumbnail: string; width: number; height: number; alt?: string; caption?: string };
export type ProjectVisualisation = {
  photos: ProjectPhoto[];
  video?: { src: string; poster: string; width: number; height: number };
};
export type DevelopmentProject = {
  slug: string;
  title: string;
  status: "Ongoing" | "Completed" | "Proposed";
  type: string;
  image: string;
  imageAlt: string;
  thumbnail?: { src: string; alt: string; caption?: string };
  summary?: string;
  imageCaption?: string;
};

export const DEVELOPMENT_PROJECTS: readonly DevelopmentProject[] = [
  {
    slug: "bafwwa-cafe",
    title: "BAFWWA Café",
    status: "Ongoing",
    type: "Roadside Café & Boutique Shop",
    image: "/images/projects/cafe-cover.webp",
    imageAlt: "Architectural visualisation of the BAFWWA Café and boutique shop",
    summary: "An ongoing roadside café and boutique shop project. Explore 3D visualisations, a project walkthrough and the latest photographs from the site.",
    imageCaption: "Architectural visualisation",
  },
  {
    slug: "baf-ops-office-interior",
    title: "BAF Ops Office Interior Project",
    status: "Completed",
    type: "Office Interior",
    image: "/images/projects/after-047.webp",
    imageAlt: "Finished BAF Ops office interior with timber finishes and recessed lighting",
    thumbnail: {
      src: "/images/projects/3d/office-conference-room-03.webp",
      alt: "3D visualisation of the BAF Ops office conference room",
      caption: "3D Visualisation",
    },
  },
  {
    slug: "sks-city",
    title: "SKS City",
    status: "Proposed",
    type: "Integrated Mixed-use Development",
    image: "/images/projects/sks-city-concept.webp",
    imageAlt: "Illustrative photograph of modern commercial buildings",
    summary: "A proposed destination bringing together business, hospitality, convention, exhibition, amusement and lifestyle facilities.",
    imageCaption: "Illustrative image",
  },
];

export const PROJECT_GALLERIES: Record<string, ProjectPhoto[]> = media;
export const PROJECT_VISUALISATIONS: Record<string, ProjectVisualisation | undefined> = visualisations;

export const PROJECT_STATUS_STYLE = {
  Ongoing: "bg-[#D9A11A] text-[#1B1B1B]",
  Completed: "bg-[#0B5E3C] text-white",
  Proposed: "bg-white text-[#0B5E3C] border border-[#0B5E3C]/15",
};

export const SKS_IMAGE_SOURCE = {
  url: "https://unsplash.com/photos/modern-glass-office-buildings-in-city-r326KF3bG5o",
  credit: "MChe Lee / Unsplash",
};
