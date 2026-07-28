export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "checkbox"
  | "select"
  | "json"
  | "date"
  | "email"
  | "url"
  | "tags"
  | "reference"
  | "media"
  | "media-list";

export type FieldDefinition = {
  key: string;
  label: string;
  type?: FieldType;
  options?: string[];
  required?: boolean;
  help?: string;
  placeholder?: string;
  min?: number;
  max?: number;
  referenceResource?: string;
  relationKey?: string;
  mediaRole?: "PRIMARY" | "THUMBNAIL" | "GALLERY" | "LOGO" | "COVER" | "DOCUMENT" | "OG_IMAGE" | "BACKGROUND";
};

export type ResourceDefinition = {
  label: string;
  permission: string;
  description: string;
  fields: FieldDefinition[];
  createDefaults?: Record<string, unknown>;
};

const status = ["DRAFT", "PUBLISHED", "ARCHIVED"];
const recordStatus = ["ACTIVE", "INACTIVE", "ARCHIVED"];
const addressHelp = 'Example: {"line1":"House 1, Road 2","city":"Dhaka","country":"Bangladesh"}';
const seoHelp = 'Optional SEO object, for example: {"title":"Page title","description":"Search description"}';

export const adminResources: Record<string, ResourceDefinition> = {
  "hero-slides": {
    label: "Hero slides",
    permission: "content",
    description: "Homepage banners, calls to action, and their background images.",
    createDefaults: { status: "DRAFT", sortOrder: 0 },
    fields: [
      { key: "title", label: "Title", required: true },
      { key: "eyebrow", label: "Eyebrow" },
      { key: "subtitle", label: "Subtitle", type: "textarea" },
      { key: "ctaLabel", label: "Button label" },
      { key: "ctaUrl", label: "Button URL", type: "url" },
      { key: "mediaId", label: "Background image", type: "media", required: true, relationKey: "media", mediaRole: "BACKGROUND" },
      { key: "sortOrder", label: "Display order", type: "number", min: 0 },
      { key: "status", label: "Status", type: "select", options: status }
    ]
  },
  categories: {
    label: "Categories",
    permission: "categories",
    description: "Classification used by properties, projects, services, and other content.",
    createDefaults: { categoryType: "PROPERTY", status: "ACTIVE", sortOrder: 0 },
    fields: [
      { key: "name", label: "Name", required: true },
      { key: "categoryType", label: "Category type", type: "select", options: ["PROPERTY", "PROJECT", "SERVICE", "BLOG", "DOWNLOAD", "GALLERY"], required: true },
      { key: "parentId", label: "Parent category", type: "reference", referenceResource: "categories", relationKey: "parent" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "media", label: "Category image", type: "media-list", mediaRole: "PRIMARY" },
      { key: "seo", label: "SEO", type: "json", help: seoHelp },
      { key: "sortOrder", label: "Display order", type: "number", min: 0 },
      { key: "status", label: "Status", type: "select", options: recordStatus }
    ]
  },
  properties: {
    label: "Properties",
    permission: "properties",
    description: "Sale, rent, and lease listings displayed on the public website.",
    createDefaults: { listingType: "SALE", availability: "AVAILABLE", currency: "BDT", status: "DRAFT", isFeatured: false, isDemo: false },
    fields: [
      { key: "referenceCode", label: "Reference code", required: true, placeholder: "ST-PROP-013" },
      { key: "title", label: "Title", required: true },
      { key: "shortDescription", label: "Short description", type: "textarea" },
      { key: "description", label: "Full description", type: "textarea" },
      { key: "listingType", label: "Listing type", type: "select", options: ["SALE", "RENT", "LEASE"], required: true },
      { key: "availability", label: "Availability", type: "select", options: ["AVAILABLE", "RESERVED", "SOLD", "RENTED", "UPCOMING"] },
      { key: "price", label: "Numeric price", type: "number", min: 0 },
      { key: "currency", label: "Currency", placeholder: "BDT" },
      { key: "priceLabel", label: "Display price" },
      { key: "bedrooms", label: "Bedrooms", type: "number", min: 0 },
      { key: "bathrooms", label: "Bathrooms", type: "number", min: 0 },
      { key: "balconies", label: "Balconies", type: "number", min: 0 },
      { key: "parkingSpaces", label: "Parking spaces", type: "number", min: 0 },
      { key: "areaSqft", label: "Area (sqft)", type: "number", min: 1 },
      { key: "furnishing", label: "Furnishing", type: "select", options: ["", "UNFURNISHED", "SEMI_FURNISHED", "FURNISHED"] },
      { key: "projectId", label: "Development project", type: "reference", referenceResource: "projects", relationKey: "project" },
      { key: "address", label: "Address", type: "json", help: addressHelp },
      { key: "media", label: "Property images", type: "media-list", mediaRole: "PRIMARY" },
      { key: "seo", label: "SEO", type: "json", help: seoHelp },
      { key: "isFeatured", label: "Featured property", type: "checkbox" },
      { key: "status", label: "Status", type: "select", options: status }
    ]
  },
  projects: {
    label: "Projects",
    permission: "projects",
    description: "Development projects, construction progress, dates, and imagery.",
    createDefaults: { developmentStatus: "UPCOMING", status: "DRAFT", completionPercent: 0, isFeatured: false, isDemo: false },
    fields: [
      { key: "title", label: "Title", required: true },
      { key: "summary", label: "Summary", type: "textarea" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "developmentStatus", label: "Development status", type: "select", options: ["UPCOMING", "ONGOING", "COMPLETED", "ON_HOLD"] },
      { key: "completionPercent", label: "Completion percent", type: "number", min: 0, max: 100 },
      { key: "startDate", label: "Start date", type: "date" },
      { key: "expectedCompletion", label: "Expected completion", type: "date" },
      { key: "categoryId", label: "Category", type: "reference", referenceResource: "categories", relationKey: "category" },
      { key: "address", label: "Address", type: "json", help: addressHelp },
      { key: "media", label: "Project images", type: "media-list", mediaRole: "PRIMARY" },
      { key: "seo", label: "SEO", type: "json", help: seoHelp },
      { key: "isFeatured", label: "Featured project", type: "checkbox" },
      { key: "status", label: "Status", type: "select", options: status }
    ]
  },
  amenities: {
    label: "Amenities",
    permission: "properties",
    description: "Reusable features such as parking, security, gyms, and pools.",
    createDefaults: { status: "ACTIVE", sortOrder: 0 },
    fields: [
      { key: "name", label: "Name", required: true },
      { key: "icon", label: "Icon name" },
      { key: "sortOrder", label: "Display order", type: "number", min: 0 },
      { key: "status", label: "Status", type: "select", options: recordStatus }
    ]
  },
  services: {
    label: "Services",
    permission: "services",
    description: "Public service offerings and supporting media.",
    createDefaults: { status: "DRAFT", isFeatured: false, sortOrder: 0 },
    fields: [
      { key: "title", label: "Title", required: true },
      { key: "summary", label: "Summary", type: "textarea", required: true },
      { key: "description", label: "Description", type: "textarea" },
      { key: "icon", label: "Icon name" },
      { key: "categoryId", label: "Category", type: "reference", referenceResource: "categories", relationKey: "category" },
      { key: "media", label: "Service images", type: "media-list", mediaRole: "PRIMARY" },
      { key: "seo", label: "SEO", type: "json", help: seoHelp },
      { key: "isFeatured", label: "Featured service", type: "checkbox" },
      { key: "status", label: "Status", type: "select", options: status }
    ]
  },
  gallery: {
    label: "Gallery albums",
    permission: "gallery",
    description: "Albums that organize project and company photography.",
    createDefaults: { status: "DRAFT", sortOrder: 0 },
    fields: [
      { key: "title", label: "Title", required: true },
      { key: "description", label: "Description", type: "textarea" },
      { key: "categoryId", label: "Category", type: "reference", referenceResource: "categories", relationKey: "category" },
      { key: "seo", label: "SEO", type: "json", help: seoHelp },
      { key: "sortOrder", label: "Display order", type: "number", min: 0 },
      { key: "status", label: "Status", type: "select", options: status }
    ]
  },
  "gallery-items": {
    label: "Gallery items",
    permission: "gallery",
    description: "Individual photos within a gallery album.",
    createDefaults: { status: "DRAFT", sortOrder: 0 },
    fields: [
      { key: "albumId", label: "Album", type: "reference", referenceResource: "gallery", relationKey: "album", required: true },
      { key: "mediaId", label: "Image", type: "media", relationKey: "media", required: true },
      { key: "title", label: "Title" },
      { key: "caption", label: "Caption", type: "textarea" },
      { key: "sortOrder", label: "Display order", type: "number", min: 0 },
      { key: "status", label: "Status", type: "select", options: status }
    ]
  },
  blogs: {
    label: "Blog posts",
    permission: "blog",
    description: "Long-form insights and editorial content.",
    createDefaults: { status: "DRAFT", isFeatured: false },
    fields: [
      { key: "title", label: "Title", required: true },
      { key: "excerpt", label: "Excerpt", type: "textarea" },
      { key: "body", label: "Article body", type: "textarea", required: true },
      { key: "categoryId", label: "Category", type: "reference", referenceResource: "categories", relationKey: "category" },
      { key: "tagNames", label: "Tags", type: "tags", help: "Separate tags with commas." },
      { key: "seo", label: "SEO", type: "json", help: seoHelp },
      { key: "isFeatured", label: "Featured post", type: "checkbox" },
      { key: "status", label: "Status", type: "select", options: status }
    ]
  },
  news: {
    label: "News",
    permission: "blog",
    description: "Company announcements and project updates.",
    createDefaults: { status: "DRAFT", isFeatured: false },
    fields: [
      { key: "title", label: "Headline", required: true },
      { key: "excerpt", label: "Excerpt", type: "textarea" },
      { key: "body", label: "Article body", type: "textarea", required: true },
      { key: "categoryId", label: "Category", type: "reference", referenceResource: "categories", relationKey: "category" },
      { key: "tagNames", label: "Tags", type: "tags", help: "Separate tags with commas." },
      { key: "seo", label: "SEO", type: "json", help: seoHelp },
      { key: "isFeatured", label: "Featured article", type: "checkbox" },
      { key: "status", label: "Status", type: "select", options: status }
    ]
  },
  certificates: {
    label: "Certificates",
    permission: "certificates",
    description: "Company certifications, issuers, dates, and evidence files.",
    createDefaults: { status: "ACTIVE", sortOrder: 0 },
    fields: [
      { key: "name", label: "Certificate name", required: true },
      { key: "issuer", label: "Issuer", required: true },
      { key: "certificateNo", label: "Certificate number" },
      { key: "issuedAt", label: "Issued date", type: "date" },
      { key: "expiresAt", label: "Expiry date", type: "date" },
      { key: "media", label: "Certificate media", type: "media-list", mediaRole: "DOCUMENT" },
      { key: "seo", label: "SEO", type: "json", help: seoHelp },
      { key: "status", label: "Status", type: "select", options: recordStatus }
    ]
  },
  clients: {
    label: "Clients",
    permission: "clients",
    description: "Client organizations, logos, contacts, and testimonials.",
    createDefaults: { status: "ACTIVE", sortOrder: 0 },
    fields: [
      { key: "name", label: "Name", required: true },
      { key: "website", label: "Website", type: "url" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "contacts", label: "Contacts", type: "json", help: 'Example: [{"name":"Contact name","designation":"Director"}]' },
      { key: "media", label: "Client logo/media", type: "media-list", mediaRole: "LOGO" },
      { key: "seo", label: "SEO", type: "json", help: seoHelp },
      { key: "status", label: "Status", type: "select", options: recordStatus }
    ]
  },
  testimonials: {
    label: "Testimonials",
    permission: "testimonials",
    description: "Client feedback displayed across public pages.",
    createDefaults: { status: "DRAFT", rating: 5, isFeatured: false, sortOrder: 0 },
    fields: [
      { key: "quote", label: "Quote", type: "textarea", required: true },
      { key: "clientId", label: "Client", type: "reference", referenceResource: "clients", relationKey: "client" },
      { key: "rating", label: "Rating", type: "number", min: 1, max: 5 },
      { key: "isFeatured", label: "Featured testimonial", type: "checkbox" },
      { key: "sortOrder", label: "Display order", type: "number", min: 0 },
      { key: "status", label: "Status", type: "select", options: status }
    ]
  },
  faqs: {
    label: "FAQs",
    permission: "content",
    description: "Frequently asked questions grouped for public display.",
    createDefaults: { status: "DRAFT", isFeatured: false, sortOrder: 0 },
    fields: [
      { key: "question", label: "Question", required: true },
      { key: "answer", label: "Answer", type: "textarea", required: true },
      { key: "group", label: "Group" },
      { key: "isFeatured", label: "Featured FAQ", type: "checkbox" },
      { key: "sortOrder", label: "Display order", type: "number", min: 0 },
      { key: "status", label: "Status", type: "select", options: status }
    ]
  },
  partners: {
    label: "Partners",
    permission: "partners",
    description: "Business partners and their logos.",
    createDefaults: { status: "ACTIVE", sortOrder: 0 },
    fields: [
      { key: "name", label: "Name", required: true },
      { key: "website", label: "Website", type: "url" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "media", label: "Partner logo/media", type: "media-list", mediaRole: "LOGO" },
      { key: "status", label: "Status", type: "select", options: recordStatus }
    ]
  },
  "career-jobs": {
    label: "Career jobs",
    permission: "careers",
    description: "Open positions and application requirements.",
    createDefaults: { status: "DRAFT", employmentType: "FULL_TIME" },
    fields: [
      { key: "title", label: "Job title", required: true },
      { key: "location", label: "Location" },
      { key: "employmentType", label: "Employment type", type: "select", options: ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"], required: true },
      { key: "description", label: "Description", type: "textarea", required: true },
      { key: "responsibilities", label: "Responsibilities", type: "textarea" },
      { key: "requirements", label: "Requirements", type: "textarea" },
      { key: "closesAt", label: "Closing date", type: "date" },
      { key: "seo", label: "SEO", type: "json", help: seoHelp },
      { key: "status", label: "Status", type: "select", options: ["DRAFT", "OPEN", "CLOSED", "ARCHIVED"] }
    ]
  },
  applications: {
    label: "Applications",
    permission: "applications",
    description: "Candidate applications and attached résumés.",
    createDefaults: { status: "NEW" },
    fields: [
      { key: "jobPostingId", label: "Job", type: "reference", referenceResource: "career-jobs", relationKey: "jobPosting", required: true },
      { key: "fullName", label: "Full name", required: true },
      { key: "email", label: "Email", type: "email", required: true },
      { key: "phone", label: "Phone" },
      { key: "coverLetter", label: "Cover letter", type: "textarea" },
      { key: "resumeMediaId", label: "Résumé", type: "media", relationKey: "resume" },
      { key: "status", label: "Status", type: "select", options: ["NEW", "REVIEWING", "SHORTLISTED", "REJECTED", "HIRED"] }
    ]
  },
  "factory-information": {
    label: "Factory information",
    permission: "factories",
    description: "Factory details, capabilities, address, and supporting media.",
    createDefaults: { status: "ACTIVE" },
    fields: [
      { key: "name", label: "Name", required: true },
      { key: "description", label: "Description", type: "textarea" },
      { key: "establishedYear", label: "Established year", type: "number", min: 1800 },
      { key: "totalAreaSqft", label: "Total area (sqft)", type: "number", min: 1 },
      { key: "employeeCount", label: "Employees", type: "number", min: 1 },
      { key: "monthlyCapacity", label: "Monthly capacity" },
      { key: "address", label: "Address", type: "json", help: addressHelp },
      { key: "capabilities", label: "Capabilities", type: "json", help: 'Example: [{"name":"Production","value":"1000","unit":"units"}]' },
      { key: "media", label: "Factory media", type: "media-list", mediaRole: "PRIMARY" },
      { key: "seo", label: "SEO", type: "json", help: seoHelp },
      { key: "status", label: "Status", type: "select", options: recordStatus }
    ]
  },
  "contact-details": {
    label: "Contact details",
    permission: "contact",
    description: "Office locations and public contact information.",
    createDefaults: { status: "ACTIVE", sortOrder: 0 },
    fields: [
      { key: "name", label: "Location name", required: true },
      { key: "email", label: "Email", type: "email" },
      { key: "phone", label: "Phone" },
      { key: "address", label: "Address", type: "json", help: addressHelp, required: true },
      { key: "sortOrder", label: "Display order", type: "number", min: 0 },
      { key: "status", label: "Status", type: "select", options: recordStatus }
    ]
  },
  "company-information": {
    label: "Company information",
    permission: "settings",
    description: "Company name, address, phone, email, and related global values.",
    createDefaults: { status: "PUBLISHED" },
    fields: [
      { key: "key", label: "Setting key", required: true },
      { key: "value", label: "Value", type: "json", required: true },
      { key: "mediaId", label: "Associated media", type: "media", relationKey: "media" },
      { key: "status", label: "Status", type: "select", options: status }
    ]
  },
  "social-media": {
    label: "Social media",
    permission: "settings",
    description: "Public social network links.",
    createDefaults: { status: "PUBLISHED" },
    fields: [
      { key: "key", label: "Network key", required: true },
      { key: "value", label: "URL/value", type: "json", required: true },
      { key: "status", label: "Status", type: "select", options: status }
    ]
  },
  footer: {
    label: "Footer settings",
    permission: "settings",
    description: "Footer copy, links, and global legal labels.",
    createDefaults: { status: "PUBLISHED" },
    fields: [
      { key: "key", label: "Setting key", required: true },
      { key: "value", label: "Value", type: "json", required: true },
      { key: "status", label: "Status", type: "select", options: status }
    ]
  },
  menus: {
    label: "Menu settings",
    permission: "settings",
    description: "Navigation labels and destinations.",
    createDefaults: { status: "PUBLISHED" },
    fields: [
      { key: "key", label: "Setting key", required: true },
      { key: "value", label: "Value", type: "json", required: true },
      { key: "status", label: "Status", type: "select", options: status }
    ]
  },
  "website-settings": {
    label: "Website settings",
    permission: "settings",
    description: "Advanced global website configuration.",
    createDefaults: { status: "PUBLISHED" },
    fields: [
      { key: "group", label: "Group", required: true },
      { key: "key", label: "Setting key", required: true },
      { key: "value", label: "Value", type: "json" },
      { key: "mediaId", label: "Associated media", type: "media", relationKey: "media" },
      { key: "status", label: "Status", type: "select", options: status }
    ]
  },
  seo: {
    label: "SEO",
    permission: "seo",
    description: "Search metadata, social sharing previews, canonical URLs, and structured data.",
    createDefaults: { status: "PUBLISHED", robots: "index,follow" },
    fields: [
      { key: "title", label: "SEO title", required: true },
      { key: "description", label: "Meta description", type: "textarea" },
      { key: "keywords", label: "Keywords" },
      { key: "canonicalUrl", label: "Canonical URL", type: "url" },
      { key: "robots", label: "Robots directive" },
      { key: "ogTitle", label: "Social title" },
      { key: "ogDescription", label: "Social description", type: "textarea" },
      { key: "ogImageId", label: "Social image", type: "media", relationKey: "ogImage", mediaRole: "OG_IMAGE" },
      { key: "structuredData", label: "Structured data", type: "json", help: "Enter a valid JSON-LD object." },
      { key: "status", label: "Status", type: "select", options: status }
    ]
  },
  downloads: {
    label: "Downloads",
    permission: "downloads",
    description: "Public documents such as brochures and company profiles.",
    createDefaults: { status: "DRAFT", sortOrder: 0 },
    fields: [
      { key: "title", label: "Title", required: true },
      { key: "description", label: "Description", type: "textarea" },
      { key: "fileMediaId", label: "Download file", type: "media", relationKey: "fileMedia", required: true, mediaRole: "DOCUMENT" },
      { key: "categoryId", label: "Category", type: "reference", referenceResource: "categories", relationKey: "category" },
      { key: "seo", label: "SEO", type: "json", help: seoHelp },
      { key: "sortOrder", label: "Display order", type: "number", min: 0 },
      { key: "status", label: "Status", type: "select", options: status }
    ]
  },
  "company-statistics": {
    label: "Company statistics",
    permission: "settings",
    description: "Public numeric achievements and metrics.",
    createDefaults: { status: "ACTIVE", sortOrder: 0 },
    fields: [
      { key: "label", label: "Label", required: true },
      { key: "value", label: "Value", type: "number", required: true },
      { key: "prefix", label: "Prefix" },
      { key: "suffix", label: "Suffix" },
      { key: "note", label: "Note" },
      { key: "sortOrder", label: "Display order", type: "number", min: 0 },
      { key: "status", label: "Status", type: "select", options: recordStatus }
    ]
  }
};

export function getAdminResource(resource: string) {
  return adminResources[resource] ?? adminResources.properties;
}
