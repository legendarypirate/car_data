const PRODUCTION_API = "https://carapi.teensclub.mn";
const LOCAL_API = "http://localhost:4001";

declare global {
  interface Window {
    __NDA_API_URL__?: string;
  }
}

function strip(url: string) {
  return url.trim().replace(/\/$/, "");
}

function isLocalHostName(host: string) {
  return (
    host === "localhost" ||
    host === "127.0.0.1" ||
    host === "::1" ||
    host.endsWith(".local") ||
    /^\d+\.\d+\.\d+\.\d+$/.test(host)
  );
}

export function getApiUrl() {
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (isLocalHostName(host)) return LOCAL_API;
    if (host.includes("teensclub.mn")) return PRODUCTION_API;
    return LOCAL_API;
  }

  const fromEnv = strip(
    process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "",
  );
  if (fromEnv) return fromEnv;

  if (process.env.NODE_ENV === "production") return PRODUCTION_API;
  return LOCAL_API;
}

export function apiPath(path: string) {
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${getApiUrl()}${suffix}`;
}
