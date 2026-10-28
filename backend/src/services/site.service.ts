import { SiteRepository } from "../repositories/site.repository";

const defaultSite = {
  company: {
    name: "Staria Properties",
    legalName: "Staria Properties",
    tagline: "Premium buying house and apparel sourcing partner.",
    established: 2010
  },
  contact: {
    address: "House#425 (First Floor), Road#30, Mohakhali DOHS, Dhaka-1206.",
    phone: "+8801709993666",
    bdAddress: "House#425 (First Floor), Road#30, Mohakhali DOHS, Dhaka-1206.",
    bdPhone: "+8801709993666",
    usAddress: "1 Great Neck Road, Ste#4, Great Neck, NY 11021.",
    usPhone: "+1(888)6139218",
    email: "info@stariadevelopment.com"
  },
  navigation: [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "Properties", path: "/properties" },
    { label: "Projects", path: "/projects" },
    { label: "Services", path: "/services" },
    { label: "Gallery", path: "/gallery" },
    { label: "Certificates", path: "/certificates" },
    { label: "News", path: "/news" },
    { label: "Career", path: "/career" },
    { label: "Contact", path: "/contact" }
  ],
  socials: {
    facebook: "",
    instagram: "",
    linkedin: "",
    twitter: ""
  }
};

export class SiteService {
  constructor(private readonly siteRepository = new SiteRepository()) {}

  async getSite() {
    const settings = await this.siteRepository.getAllSettings();
    return settings.reduce<Record<string, unknown>>(
      (acc: Record<string, unknown>, setting: { key: string; value: unknown }) => {
        acc[setting.key] = setting.value;
        return acc;
      },
      { ...defaultSite }
    );
  }
}
