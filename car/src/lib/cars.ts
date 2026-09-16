import { cars, getCar, type Car } from "@/data/cars";
import { apiPath } from "@/lib/api-url";

export async function getLiveCars(): Promise<Car[]> {
  try {
    const response = await fetch(apiPath("/api/cars"), { cache: "no-store" });
    if (!response.ok) return cars;
    const list = (await response.json()) as Car[];
    return list.length ? list : cars;
  } catch {
    return cars;
  }
}

export async function getLiveCar(slug: string): Promise<Car | undefined> {
  try {
    const response = await fetch(apiPath(`/api/cars/${slug}`), { cache: "no-store" });
    if (response.ok) return (await response.json()) as Car;
  } catch {
    // fall through
  }
  return getCar(slug);
}
