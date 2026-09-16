import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CarDetailTabs } from "@/components/CarDetailTabs";
import { cars } from "@/data/cars";
import { getLiveCar, getLiveCars } from "@/lib/cars";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return cars.map((car) => ({ slug: car.slug }));
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { slug } = await props.params;
  const car = await getLiveCar(slug);
  if (!car) return { title: "Машин | NDA AUTO" };
  return {
    title: `${car.brand} ${car.name} (${car.year}) | NDA AUTO`,
    description: car.description,
  };
}

export default async function CarDetailPage(props: PageProps) {
  const { slug } = await props.params;
  const car = await getLiveCar(slug);
  if (!car) notFound();

  const all = await getLiveCars();
  const similar = all.filter((item) => item.slug !== car.slug).slice(0, 4);

  return (
    <main className="min-h-screen bg-white">
      <CarDetailTabs car={car} similar={similar} />
    </main>
  );
}
