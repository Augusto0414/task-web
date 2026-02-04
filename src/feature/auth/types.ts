export interface AuthState {
  token: string | null;
  user: {
    id: number | string;
    name: string;
    email: string;
  } | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

export interface RegisterPayload {
  name?: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}
