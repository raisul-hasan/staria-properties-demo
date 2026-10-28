type ConsultancyProject = {
  title: string;
  ongoing?: boolean;
  image?: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
};

// Project order and images follow the supplied Consultancy Projects document.
export const CONSULTANCY_PROJECTS: readonly ConsultancyProject[] = [
  {
    title: "EIA Study for Construction of Flyover Project along Marine Drive Road 1st 1.70 km Damaged Portion (Kolatoli to Niribili Hatchery point)",
    image: {
      src: "/images/consultancy/projects/marine-drive-flyover-eia.png",
      alt: "Location map of the Marine Drive Road flyover EIA study area",
      width: 1168,
      height: 802,
    },
  },
  {
    title: "Market Survey and Feasibility Study for Bay Watch Hotel at Inani Sea Beach, Cox's Bazar",
    image: {
      src: "/images/consultancy/projects/bay-watch-hotel-feasibility.png",
      alt: "Satellite map marking the Bay Watch Hotel site at Inani Sea Beach",
      width: 1498,
      height: 747,
    },
  },
  {
    title: "Traffic Modeling and Feasibility Study of Proposed Kalshi Flyover from ECB Chattar to Mirpur DOHS, Dhaka.",
    image: {
      src: "/images/consultancy/projects/kalshi-flyover-feasibility.png",
      alt: "Route drawing for the proposed Kalshi Flyover from ECB Chattar to Mirpur DOHS",
      width: 505,
      height: 851,
    },
  },
  {
    title: "Transportation Demand Forecast Modeling and Feasibility Study for Proposed Road Widening (23.0 Km) and Realignment of 6.0 Km Road Infrastructures of Existing Marine Drive Road at Cox’s Bazar, Chittagong.",
    image: {
      src: "/images/consultancy/projects/marine-drive-road-feasibility.png",
      alt: "Map showing the Marine Drive road widening, realignment and proposed Reju Khal bridge",
      width: 1116,
      height: 672,
    },
  },
  {
    title: "Detailed Survey, Feasibility Studies, Master Planning, Architectural & Engineering Design, Visualization, Cost & Financial Planning and Preparation of Development Project Proposal (DPP) for the 2nd BD Battalion",
    ongoing: true,
  },
  {
    title: "Conducting Detail Techno-economic Feasibility Study for the Proposed Two Tourist Centers of 16th ECB, Bangladesh Army at Teknaf, Cox’s Bazar.",
    image: {
      src: "/images/consultancy/projects/teknaf-tourist-centers.png",
      alt: "Marine Drive location map marking the two proposed tourist centers at Teknaf",
      width: 1347,
      height: 811,
    },
  },
  {
    title: "Feasibility Study on SKS City",
    ongoing: true,
  },
  {
    title: "Sustainable Urban Flood Resistance and Drainage Improvement Through Urban Renewal and Recreation Facilities Development at Barisal City Corporation",
    image: {
      src: "/images/consultancy/projects/barisal-drainage-improvement.png",
      alt: "Master plan for drainage improvement, urban renewal and recreation facilities at Barisal City Corporation",
      width: 2000,
      height: 659,
    },
  },
];
