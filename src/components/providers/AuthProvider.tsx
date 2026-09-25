"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import Config from "@/lib/config/app.config";

const STORAGE_KEY = "innovera_auth_user";

export interface AuthUser {
  id?: number;
  name: string;
  email: string;
  phone?: string;
  academicYear?: string;
  college?: string;
  roleInTech?: string;
  avatar?: string;
  token?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  ready: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  ready: false,
  login: () => undefined,
  logout: () => undefined,
});

function readStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthUser;
    if (!parsed?.name?.trim() || !parsed?.email?.trim()) return null;
    return {
      id: typeof parsed.id === "number" ? parsed.id : undefined,
      name: parsed.name.trim(),
      email: parsed.email.trim(),
      phone: parsed.phone?.trim() || undefined,
      academicYear: parsed.academicYear?.trim() || undefined,
      college: parsed.college?.trim() || undefined,
      roleInTech: parsed.roleInTech?.trim() || undefined,
      avatar: parsed.avatar?.trim() || undefined,
      token: parsed.token?.trim() || undefined,
    };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setUser(readStoredUser());
    setReady(true);
  }, []);

  const login = useCallback((next: AuthUser) => {
    const normalized: AuthUser = {
      id: next.id,
      name: next.name.trim(),
      email: next.email.trim(),
      phone: next.phone?.trim() || undefined,
      academicYear: next.academicYear?.trim() || undefined,
      college: next.college?.trim() || undefined,
      roleInTech: next.roleInTech?.trim() || undefined,
      avatar: next.avatar?.trim() || undefined,
      token: next.token?.trim() || undefined,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    setUser(normalized);
  }, []);

  const logout = useCallback(() => {
    const token = user?.token;
    window.localStorage.removeItem(STORAGE_KEY);
    setUser(null);
    if (token) {
      // Best-effort server-side token revocation. Local session is already
      // cleared above so the UI never waits on this.
      fetch(Config.AUTH.logout, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => undefined);
    }
  }, [user]);

  const value = useMemo(
    () => ({ user, ready, login, logout }),
    [user, ready, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

/** Map Laravel student + token into AuthUser for local session. */
export function authUserFromStudent(input: {
  student: {
    id: number;
    full_name: string;
    email: string;
    mobile_number?: string | null;
    academic_year?: string | null;
    college?: string | null;
    role_in_tech?: string | null;
    avatar?: string | null;
  };
  token: string;
}): AuthUser {
  const { student, token } = input;
  return {
    id: student.id,
    name: student.full_name,
    email: student.email,
    phone: student.mobile_number ?? undefined,
    academicYear: student.academic_year ?? undefined,
    college: student.college ?? undefined,
    roleInTech: student.role_in_tech ?? undefined,
    avatar: student.avatar ?? undefined,
    token,
  };
}

/** Derive a display name from email when signup name is unavailable. */
export function displayNameFromEmail(email: string): string {
  const local = email.split("@")[0]?.trim() || "User";
  return local
    .replace(/[._-]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
