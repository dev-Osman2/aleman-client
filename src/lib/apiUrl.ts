const DEFAULT_API_URL = "http://127.0.0.1:5000/api";

export function getApiUrl(): string {
  const configuredUrl =
    (typeof window === "undefined"
      ? process.env.INTERNAL_API_URL
      : undefined) ||
    process.env.NEXT_PUBLIC_API_URL ||
    DEFAULT_API_URL;

  return configuredUrl.replace(/\/+$/, "");
}
