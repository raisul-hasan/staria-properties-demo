import { createBrowserRouter } from "react-router";
import Layout from "./Layout";
import HomePage from "./pages/HomePage";
import ErrorPage from "./pages/ErrorPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    errorElement: <ErrorPage />,
    children: [
      { index: true, Component: HomePage },
      { path: "about", lazy: async () => ({ Component: (await import("./pages/AboutPage")).default }) },
      { path: "development", lazy: async () => ({ Component: (await import("./pages/DevelopmentPage")).default }) },
      { path: "properties", lazy: async () => ({ Component: (await import("./pages/PropertiesPage")).default }) },
      { path: "properties/:id", lazy: async () => ({ Component: (await import("./pages/PropertiesPage")).default }) },
      { path: "interior", lazy: async () => ({ Component: (await import("./pages/InteriorPage")).default }) },
      { path: "projects", lazy: async () => ({ Component: (await import("./pages/ProjectsPage")).default }) },
      { path: "projects/:id", lazy: async () => ({ Component: (await import("./pages/ProjectsPage")).default }) },
      { path: "news", lazy: async () => ({ Component: (await import("./pages/NewsPage")).default }) },
      { path: "news/:id", lazy: async () => ({ Component: (await import("./pages/NewsPage")).default }) },
      { path: "contact", lazy: async () => ({ Component: (await import("./pages/ContactPage")).default }) },
      { path: "privacy", lazy: async () => ({ Component: (await import("./pages/LegalPage")).default }) },
      { path: "terms", lazy: async () => ({ Component: (await import("./pages/LegalPage")).default }) },
      { path: "cookies", lazy: async () => ({ Component: (await import("./pages/LegalPage")).default }) },
      { path: "*", Component: ErrorPage },
    ],
  },
  { path: "/admin/login", lazy: async () => ({ Component: (await import("./admin/AdminLoginPage")).default }) },
  { path: "/admin/forgot-password", lazy: async () => ({ Component: (await import("./admin/AdminPasswordPages")).AdminForgotPasswordPage }) },
  { path: "/admin/reset-password", lazy: async () => ({ Component: (await import("./admin/AdminPasswordPages")).AdminResetPasswordPage }) },
  {
    path: "/admin",
    errorElement: <ErrorPage />,
    lazy: async () => ({ Component: (await import("./admin/AdminAuth")).AdminAuthProvider }),
    children: [
      {
        lazy: async () => ({ Component: (await import("./admin/AdminAuth")).RequireAdmin }),
        children: [
          {
            lazy: async () => ({ Component: (await import("./admin/AdminLayout")).default }),
            children: [
              { index: true, lazy: async () => ({ Component: (await import("./admin/AdminDashboardPage")).default }) },
              { path: "content/:resource", lazy: async () => ({ Component: (await import("./admin/AdminResourcePage")).default }) },
              { path: "enquiries", lazy: async () => ({ Component: (await import("./admin/AdminEnquiriesPage")).default }) },
              { path: "media", lazy: async () => ({ Component: (await import("./admin/AdminMediaLibrary")).default }) },
              { path: "account", lazy: async () => ({ Component: (await import("./admin/AdminAccountPage")).default }) }
            ]
          }
        ]
      }
    ]
  }
]);
