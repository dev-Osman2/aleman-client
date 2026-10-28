import { getAdminToken, removeAdminToken } from "./cookies";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api";

export async function adminFetch(
  pathOrUrl: string,
  options: RequestInit = {},
): Promise<Response> {
  const token = getAdminToken();
  const url = pathOrUrl.startsWith("http")
    ? pathOrUrl
    : `${apiUrl}${pathOrUrl}`;

  const headers = new Headers(options.headers || {});
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(url, {
    ...options,
    headers,
  });

  if (res.status === 401 || res.status === 403) {
    removeAdminToken();
    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname;
      if (currentPath !== "/lib" && currentPath !== "/lib/") {
        // eslint-disable-next-line @next/next/no-location-assign-relative-destination
        window.location.href = "/lib";
      }
    }
  }

  return res;
}
