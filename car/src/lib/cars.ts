import type { Car } from "@/data/cars";
import { apiPath } from "@/lib/api-url";

export function carHref(car: Pick<Car, "uuid" | "id" | "slug">) {
  return `/inventory/${car.uuid || car.id || car.slug}`;
}

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

export async function getLiveCar(id: string): Promise<Car | undefined> {
  try {
    const response = await fetch(apiPath(`/api/cars/${id}`), { cache: "no-store" });
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
