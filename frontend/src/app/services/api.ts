export const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1").replace(/\/$/, "");

export type ApiErrorDetail = { field?: string; message: string };
export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
  errors?: ApiErrorDetail[];
};

export type PaginationMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type ApiList<T> = {
  items: T[];
  meta: PaginationMeta;
};

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly details: ApiErrorDetail[] = []
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function buildHeaders(options?: RequestInit) {
  const headers = new Headers(options?.headers);
  if (options?.body && !(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  return headers;
}

async function request<T>(endpoint: string, options?: RequestInit, allowRefresh = true): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: buildHeaders(options)
  });

  if (response.status === 401 && allowRefresh && endpoint !== "/auth/login" && endpoint !== "/auth/refresh") {
    try {
      await request("/auth/refresh", { method: "POST", body: JSON.stringify({}) }, false);
      return request<T>(endpoint, options, false);
    } catch {
      // The original unauthorized response is more useful to the caller.
    }
  }

  let payload: ApiResponse<T>;
  try {
    payload = (await response.json()) as ApiResponse<T>;
  } catch {
    throw new ApiError("The server returned an invalid response.", response.status);
  }

  if (!response.ok || !payload.success) {
    throw new ApiError(payload.errors?.[0]?.message || payload.message || "API request failed.", response.status, payload.errors);
  }
  return payload.data as T;
}

function queryString(query: Record<string, string | number | boolean | undefined> = {}) {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== "") params.set(key, String(value));
  });
  const serialized = params.toString();
  return serialized ? `?${serialized}` : "";
}

export const api = {
  getProperties: (query: Record<string, string | number | boolean | undefined> = {}) =>
    request<ApiList<PropertyRecord>>(`/content/properties${queryString(query)}`),
  getPropertyById: (id: string) => request<PropertyRecord>(`/content/properties/${encodeURIComponent(id)}`),
  getProjects: (query: Record<string, string | number | boolean | undefined> = {}) =>
    request<ApiList<ProjectRecord>>(`/content/projects${queryString(query)}`),
  getProjectById: (id: string) => request<ProjectRecord>(`/content/projects/${encodeURIComponent(id)}`),
  getNews: (query: Record<string, string | number | boolean | undefined> = {}) =>
    request<ApiList<NewsRecord>>(`/content/news${queryString(query)}`),
  getNewsById: (id: string) => request<NewsRecord>(`/content/news/${encodeURIComponent(id)}`),
  getFaqs: () => request<ApiList<FaqRecord>>("/content/faqs?limit=100"),
  getServices: () => request<ApiList<ServiceRecord>>("/content/services?limit=100"),
  getTestimonials: () => request<ApiList<TestimonialRecord>>("/content/testimonials?limit=100"),
  getGallery: () => request<ApiList<Record<string, unknown>>>("/content/gallery?limit=100"),
  getHeroSlides: () => request<ApiList<HeroSlideRecord>>("/content/hero-slides?limit=100"),
  getCompanyStats: () => request<ApiList<StatisticRecord>>("/content/stats?limit=100"),
  getSiteInfo: () => request<SiteInfo>("/site"),

  submitContact: (data: { fullName: string; email: string; phone?: string; subject?: string; message: string; consentAccepted: true }) =>
    request("/contact", { method: "POST", body: JSON.stringify({ ...data, source: "website" }) }),
  subscribeNewsletter: (email: string, consentAccepted: true) =>
    request("/newsletter/subscribe", {
      method: "POST",
      body: JSON.stringify({ email, consentAccepted, source: "website" })
    }),
  submitQuotation: (data: Record<string, unknown>) =>
    request("/quotations", { method: "POST", body: JSON.stringify(data) }),

  login: (email: string, password: string) =>
    request<AuthResult>("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }, false),
  me: () => request<AdminUser>("/auth/me"),
  logout: () => request<void>("/auth/logout", { method: "POST" }, false),
  forgotPassword: (email: string) =>
    request<void>("/auth/forgot-password", { method: "POST", body: JSON.stringify({ email }) }, false),
  resetPassword: (token: string, password: string) =>
    request<void>("/auth/reset-password", { method: "POST", body: JSON.stringify({ token, password }) }, false),
  changePassword: (currentPassword: string, newPassword: string, confirmPassword: string) =>
    request<void>("/auth/change-password", {
      method: "POST",
      body: JSON.stringify({ currentPassword, newPassword, confirmPassword })
    }),
  listSessions: () => request<AdminSession[]>("/auth/sessions"),
  revokeSession: (id: string) =>
    request<void>(`/auth/sessions/${encodeURIComponent(id)}`, { method: "DELETE" }),
  listMedia: (query: Record<string, string | number | boolean | undefined> = {}) =>
    request<ApiList<MediaAsset>>(`/admin/cms/media${queryString(query)}`),
  uploadMedia: (file: File, altText: string, kind: "image" | "file" = "image") => {
    const body = new FormData();
    body.append(kind === "image" ? "image" : "file", file);
    if (altText) body.append("altText", altText);
    return request<MediaAsset>(`/admin/cms/media/${kind === "image" ? "images" : "files"}`, {
      method: "POST",
      body
    });
  },
  listCms: <T = CmsRecord>(resource: string, query: Record<string, string | number | boolean | undefined> = {}) =>
    request<ApiList<T>>(`/admin/cms/${encodeURIComponent(resource)}${queryString(query)}`),
  getCms: <T = CmsRecord>(resource: string, id: string) =>
    request<T>(`/admin/cms/${encodeURIComponent(resource)}/${encodeURIComponent(id)}`),
  createCms: <T = CmsRecord>(resource: string, data: Record<string, unknown>) =>
    request<T>(`/admin/cms/${encodeURIComponent(resource)}`, { method: "POST", body: JSON.stringify(data) }),
  updateCms: <T = CmsRecord>(resource: string, id: string, data: Record<string, unknown>) =>
    request<T>(`/admin/cms/${encodeURIComponent(resource)}/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify(data)
    }),
  transitionCms: <T = CmsRecord>(resource: string, id: string, transition: "publish" | "draft" | "restore") =>
    request<T>(`/admin/cms/${encodeURIComponent(resource)}/${encodeURIComponent(id)}/${transition}`, { method: "PATCH" }),
  deleteCms: <T = CmsRecord>(resource: string, id: string) =>
    request<T>(`/admin/cms/${encodeURIComponent(resource)}/${encodeURIComponent(id)}`, { method: "DELETE" }),
  listContactSubmissions: (query: Record<string, string | number | boolean | undefined> = {}) =>
    request<ApiList<ContactSubmission>>(`/admin/contact-submissions${queryString(query)}`),
  listNewsletterSubscribers: (query: Record<string, string | number | boolean | undefined> = {}) =>
    request<ApiList<NewsletterSubscriber>>(`/admin/newsletter-subscribers${queryString(query)}`)
};

export type MediaAsset = {
  id: string;
  secureUrl: string;
  altText?: string | null;
  caption?: string | null;
  resourceType?: "IMAGE" | "VIDEO" | "PDF" | "RAW";
  format?: string | null;
  bytes?: number | null;
  width?: number | null;
  height?: number | null;
  createdAt?: string;
};
export type MediaLink = { role: string; sortOrder: number; media: MediaAsset };
export type AddressRecord = { line1: string; line2?: string | null; city: string; state?: string | null; country: string };
export type CategoryLink = { isPrimary: boolean; category: { id: string; name: string; slug: string } };

export type PropertyRecord = {
  id: string;
  referenceCode: string;
  title: string;
  slug: string;
  shortDescription?: string | null;
  description?: string | null;
  listingType: "SALE" | "RENT" | "LEASE";
  availability: string;
  price?: string | number | null;
  currency: string;
  priceLabel?: string | null;
  bedrooms?: number | null;
  bathrooms?: string | number | null;
  areaSqft?: string | number | null;
  furnishing?: string | null;
  status: string;
  isFeatured: boolean;
  isDemo: boolean;
  address?: AddressRecord | null;
  categories: CategoryLink[];
  media: MediaLink[];
  amenities: Array<{ amenity: { id: string; name: string; slug: string } }>;
  project?: { id: string; title: string; slug: string } | null;
};

export type ProjectRecord = {
  id: string;
  title: string;
  slug: string;
  summary?: string | null;
  description?: string | null;
  developmentStatus: "UPCOMING" | "ONGOING" | "COMPLETED" | "ON_HOLD";
  completionPercent?: string | number | null;
  status: string;
  isFeatured: boolean;
  isDemo: boolean;
  category?: { id: string; name: string; slug: string } | null;
  address?: AddressRecord | null;
  media: MediaLink[];
  amenities: Array<{ amenity: { id: string; name: string; slug: string } }>;
};

export type ServiceRecord = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description?: string | null;
  icon?: string | null;
  status: string;
  isFeatured: boolean;
  media: MediaLink[];
};

export type NewsRecord = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  body: string;
  status: string;
  isFeatured: boolean;
  publishedAt?: string | null;
  category?: { name: string; slug: string } | null;
};

export type FaqRecord = {
  id: string;
  question: string;
  answer: string;
  group?: string | null;
  status: string;
  isFeatured: boolean;
};

export type TestimonialRecord = {
  id: string;
  quote: string;
  rating?: number | null;
  client?: { name: string } | null;
  clientContact?: { name: string; designation?: string | null } | null;
};

export type StatisticRecord = {
  id: string;
  label: string;
  value: string | number;
  prefix?: string | null;
  suffix?: string | null;
  note?: string | null;
};

export type HeroSlideRecord = {
  id: string;
  eyebrow?: string | null;
  title: string;
  subtitle?: string | null;
  ctaLabel?: string | null;
  ctaUrl?: string | null;
  media: MediaAsset;
};

export type SiteInfo = Record<string, unknown> & {
  company?: { name?: string; tagline?: string };
  contact?: { address?: string; phone?: string; email?: string };
};

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  status: string;
  roles: Array<{ id: string; name: string; slug: string }>;
  permissions: string[];
};

export type AuthResult = { admin: AdminUser; session: AdminSession };
export type AdminSession = { id: string; ipAddress?: string | null; userAgent?: string | null; expiresAt: string; createdAt: string };
export type CmsRecord = Record<string, unknown> & {
  id: string;
  title?: string;
  name?: string;
  question?: string;
  label?: string;
  email?: string;
  status?: string;
  isFeatured?: boolean;
  isDemo?: boolean;
  deletedAt?: string | null;
  updatedAt?: string;
};
export type ContactSubmission = CmsRecord & { fullName: string; email: string; subject?: string | null; message: string; status: string };
export type NewsletterSubscriber = CmsRecord & { email: string; fullName?: string | null; status: string };
