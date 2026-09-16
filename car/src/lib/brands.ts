import { brands as fallbackNames } from "@/data/cars";

export type Brand = {
  id: number;
  name: string;
  slug: string;
  image: string;
  carCount?: number;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const fallbackBrands: Brand[] = fallbackNames.map((name, index) => ({
  id: index + 1,
  name,
  slug: name.toLowerCase(),
  image: "",
  carCount: 0,
}));

export async function getBrands(): Promise<Brand[]> {
  try {
    const response = await fetch(`${API_URL}/api/brands`, {
      next: { revalidate: 5 },
    });
    if (!response.ok) return fallbackBrands;
    return (await response.json()) as Brand[];
  } catch {
    return fallbackBrands;
  }
}

export async function fetchBrands(): Promise<Brand[]> {
  try {
    const response = await fetch(`${API_URL}/api/brands`);
    if (!response.ok) return fallbackBrands;
    return (await response.json()) as Brand[];
  } catch {
    return fallbackBrands;
  }
}
