import { env } from "process";

interface FetchOptions extends RequestInit {
  body?: any;
}

function getFullUrl(path: string) {
  const baseUrl = env.NODE_ENV === "development" ? "http://localhost:8788" : "";
  return `${baseUrl}${path}`;
}

export async function fetchApi(path: string, options?: FetchOptions) {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  const token = localStorage.getItem("token");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return fetch(getFullUrl(path), {
    ...options,
    headers,
    body: options?.body ? JSON.stringify(options.body) : undefined,
  });
}
