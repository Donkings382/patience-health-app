// ─── Config ───────────────────────────────────────────────────────────────────

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";
const TOKEN_KEY = "healthAppToken";

// ─── Token helpers ────────────────────────────────────────────────────────────

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

// ─── Core fetch wrapper ───────────────────────────────────────────────────────

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(err.detail ?? "Request failed");
  }

  // 204 No Content — return null
  if (res.status === 204) return null as T;
  return res.json() as Promise<T>;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export type ApiUser = {
  id: number;
  name: string | null;
  email: string;
  created_at: string;
};

export type AuthResponse = {
  access_token: string;
  token_type: string;
  user: ApiUser;
};

export type HealthLogEntry = {
  id: number;
  user_id: number;
  blood_pressure: string | null;
  glucose_level: number | null;
  symptoms: string | null;
  created_at: string;
};

export type DashboardData = {
  recent_logs: HealthLogEntry[];
  latest_symptom: string | null;
};

// ─── Auth endpoints ───────────────────────────────────────────────────────────

export const authApi = {
  signup: (name: string, email: string, password: string) =>
    request<AuthResponse>("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),

  login: (email: string, password: string) =>
    request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  me: () => request<ApiUser>("/auth/me"),
};

// ─── Health log endpoints ─────────────────────────────────────────────────────

export const healthLogsApi = {
  getAll: (skip = 0, limit = 20) =>
    request<HealthLogEntry[]>(`/health-logs?skip=${skip}&limit=${limit}`),

  create: (data: { blood_pressure?: string; glucose_level?: number; symptoms?: string }) =>
    request<HealthLogEntry>("/health-logs", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: number, data: { blood_pressure?: string; glucose_level?: number; symptoms?: string }) =>
    request<HealthLogEntry>(`/health-logs/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: number) =>
    request<null>(`/health-logs/${id}`, { method: "DELETE" }),
};

// ─── Dashboard endpoint ───────────────────────────────────────────────────────

export const dashboardApi = {
  get: () => request<DashboardData>("/dashboard"),
};

// ─── Profile endpoints ────────────────────────────────────────────────────────

export const profileApi = {
  get: () => request<ApiUser>("/profile"),

  update: (name: string) =>
    request<ApiUser>("/profile", {
      method: "PUT",
      body: JSON.stringify({ name }),
    }),

  changePassword: (old_password: string, new_password: string) =>
    request<{ message: string }>("/profile/change-password", {
      method: "POST",
      body: JSON.stringify({ old_password, new_password }),
    }),
};
