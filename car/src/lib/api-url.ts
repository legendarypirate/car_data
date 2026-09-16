declare global {
  interface Window {
    __NDA_API_URL__?: string;
  }
}

function readEnv(key: string) {
  if (typeof process === "undefined" || !process.env) return "";
  return process.env[key]?.trim() || "";
}

export function getApiUrl() {
  if (typeof window !== "undefined" && window.__NDA_API_URL__) {
    return window.__NDA_API_URL__.replace(/\/$/, "");
  }

  const url =
    readEnv("API_URL") ||
    readEnv("NEXT_PUBLIC_API_URL") ||
    "http://localhost:4001";

  return url.replace(/\/$/, "");
}

export function apiPath(path: string) {
  const prefix = getApiUrl();
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${prefix}${suffix}`;
}
