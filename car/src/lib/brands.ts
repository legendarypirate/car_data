import { apiPath } from "@/lib/api-url";

export type Brand = {
  id: number;
  name: string;
  slug: string;
  image: string;
  carCount?: number;
};

export async function getBrands(): Promise<Brand[]> {
  try {
    const response = await fetch(apiPath("/api/brands"), { cache: "no-store" });
    if (!response.ok) return [];
    const list = (await response.json()) as Brand[];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export async function fetchBrands(): Promise<Brand[]> {
  try {
    const response = await fetch(apiPath("/api/brands"));
    if (!response.ok) return [];
    const list = (await response.json()) as Brand[];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}
