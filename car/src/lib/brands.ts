import { brands as fallbackNames } from "@/data/cars";
import { apiPath } from "@/lib/api-url";

export type Brand = {
  id: number;
  name: string;
  slug: string;
  image: string;
  carCount?: number;
};

export const fallbackBrands: Brand[] = fallbackNames.map((name, index) => ({
  id: index + 1,
  name,
  slug: name.toLowerCase(),
  image: "",
  carCount: 0,
}));

export async function getBrands(): Promise<Brand[]> {
  try {
    const response = await fetch(apiPath("/api/brands"), { cache: "no-store" });
    if (!response.ok) return fallbackBrands;
    return (await response.json()) as Brand[];
  } catch {
    return fallbackBrands;
  }
}

export async function fetchBrands(): Promise<Brand[]> {
  try {
    const response = await fetch(apiPath("/api/brands"));
    if (!response.ok) return fallbackBrands;
    return (await response.json()) as Brand[];
  } catch {
    return fallbackBrands;
  }
}
