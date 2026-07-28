import { SiteRepository } from "../repositories/site.repository";

const defaultSite = {
  company: {
    name: "Staria Properties",
    legalName: "Staria Properties",
    tagline: "Premium buying house and apparel sourcing partner.",
    established: 2010
  },
  contact: {
    address: "Dhaka, Bangladesh",
    phone: "+880 1700 000 000",
    email: "info@staria.com.bd"
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
