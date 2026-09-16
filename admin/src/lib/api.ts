const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || "Хүсэлт амжилтгүй");
  }
  return data as T;
}

export async function uploadFiles(files: FileList | File[]) {
  const body = new FormData();
  for (const file of Array.from(files)) {
    body.append("files", file);
  }
  const response = await fetch(`${API_URL}/api/uploads`, {
    method: "POST",
    body,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || "Зураг хуулж чадсангүй");
  }
  return (data.files || []) as string[];
}

export function formatAmount(amount: number) {
  if (!Number.isFinite(amount) || amount <= 0) return "";
  return Math.round(Number(amount)).toLocaleString("en-US");
}

export function parseAmount(value: string) {
  const digits = value.replace(/[^\d]/g, "");
  if (!digits) return 0;
  return Number(digits);
}

export function formatPrice(amount: number) {
  return `₮ ${formatAmount(amount) || "0"}`;
}

export function imageSrc(path?: string | null) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return `${site}${path}`;
}
