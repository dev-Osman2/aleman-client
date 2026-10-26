export type Role = "CUSTOMER" | "ADMIN";

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  id: string;
  expiresAt: string;
  token: string;
  userId: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthData {
  token: string;
  user: User;
  redirect?: boolean;
}

export interface RegisterPayload {
  name: string;
  phone: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface UpdateProfilePayload {
  name?: string;
  phone?: string;
}
