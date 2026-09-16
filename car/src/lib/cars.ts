import { cars, getCar, type Car } from "@/data/cars";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function getLiveCars(): Promise<Car[]> {
  try {
    const response = await fetch(`${API_URL}/api/cars`, { next: { revalidate: 5 } });
    if (!response.ok) return cars;
    const list = (await response.json()) as Car[];
    return list.length ? list : cars;
  } catch {
    return cars;
  }
}

export async function getLiveCar(slug: string): Promise<Car | undefined> {
  try {
    const response = await fetch(`${API_URL}/api/cars/${slug}`, { next: { revalidate: 5 } });
    if (response.ok) return (await response.json()) as Car;
  } catch {
    // fall through
  }
  return getCar(slug);
}
