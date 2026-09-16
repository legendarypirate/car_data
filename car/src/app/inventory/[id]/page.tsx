import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CarDetailTabs } from "@/components/CarDetailTabs";
import { getLiveCar, getLiveCars } from "@/lib/cars";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { id } = await props.params;
  const car = await getLiveCar(id);
  if (!car) return { title: "Машин | NDA AUTO" };
  return {
    title: `${car.brand} ${car.name} (${car.year}) | NDA AUTO`,
    description: car.description,
  };
}

export default async function CarDetailPage(props: PageProps) {
  const { id } = await props.params;
  const car = await getLiveCar(id);
  if (!car) notFound();

  const all = await getLiveCars();
  const similar = all
    .filter((item) => (item.uuid || item.slug) !== (car.uuid || car.slug))
    .slice(0, 4);

  return (
    <main className="min-h-screen bg-white">
      <CarDetailTabs car={car} similar={similar} />
    </main>
  );
}
