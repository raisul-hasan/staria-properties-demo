import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import { api, type AdminUser } from "../services/api";
import { LoadingScreen } from "../components/shared/LoadingScreen";

type AdminAuthValue = {
  user: AdminUser | null;
  loading: boolean;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
  can: (permission: string) => boolean;
};

const AdminAuthContext = createContext<AdminAuthValue | null>(null);

export function AdminAuthProvider() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    const profile = await api.me();
    setUser(profile);
  };

  useEffect(() => {
    refresh()
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo<AdminAuthValue>(
    () => ({
      user,
      loading,
      refresh,
      signOut: async () => {
        try {
          await api.logout();
        } finally {
          setUser(null);
        }
      },
      can: (permission: string) => {
        if (!user) return false;
        if (user.permissions.includes("*:*") || user.permissions.includes(permission)) return true;
        const [resource] = permission.split(":");
        return user.permissions.includes(`${resource}:*`);
      }
    }),
    [user, loading]
  );

  if (loading) return <LoadingScreen />;
  return (
    <AdminAuthContext.Provider value={value}>
      <Outlet />
    </AdminAuthContext.Provider>
  );
}

export function RequireAdmin() {
  const auth = useAdminAuth();
  const location = useLocation();
  if (!auth.user) return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  return <Outlet />;
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) throw new Error("useAdminAuth must be used inside AdminAuthProvider.");
  return context;
}
