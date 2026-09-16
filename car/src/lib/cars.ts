import type { Car } from "@/data/cars";
import { apiPath } from "@/lib/api-url";

export async function getLiveCars(): Promise<Car[]> {
  try {
    const response = await fetch(apiPath("/api/cars"), { cache: "no-store" });
    if (!response.ok) return [];
    const list = (await response.json()) as Car[];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export async function getLiveCar(slug: string): Promise<Car | undefined> {
  try {
    const response = await fetch(apiPath(`/api/cars/${slug}`), { cache: "no-store" });
    if (!response.ok) return undefined;
    return (await response.json()) as Car;
  } catch {
    return undefined;
  }
}

export async function fetchCars(): Promise<Car[]> {
  try {
    const response = await fetch(apiPath("/api/cars"));
    if (!response.ok) return [];
    const list = (await response.json()) as Car[];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}
