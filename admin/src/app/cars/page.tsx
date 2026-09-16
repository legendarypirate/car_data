"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import { api, formatPrice, imageSrc } from "@/lib/api";
import type { Car } from "@/lib/types";

const statusLabel: Record<string, string> = {
  "in-stock": "Агуулахад",
  "in-transit": "Тээвэрт",
  order: "Захиалга",
};

export default function CarsPage() {
  const router = useRouter();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      setCars(await api<Car[]>("/api/cars"));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Машин ачаалж чадсангүй");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function remove(car: Car) {
    if (!confirm(`${car.name}-г устгах уу?`)) return;
    try {
      await api(`/api/cars/${car.id}`, { method: "DELETE" });
      toast.success("Машин устгалаа");
      load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Устгаж чадсангүй");
    }
  }

  return (
    <DataTable
      rows={cars}
      loading={loading}
      emptyText="Машин олдсонгүй."
      searchPlaceholder="Нэр, брэнд, слаг хайх"
      searchKeys={["name", "brand", "slug"]}
      toolbar={
        <Button nativeButton={false} render={<Link href="/cars/new" />}>
          <Plus data-icon="inline-start" />
          Машин нэмэх
        </Button>
      }
      onEdit={(car) => router.push(`/cars/${car.id}`)}
      onDelete={remove}
      columns={[
        {
          key: "name",
          label: "Машин",
          render: (car) => (
            <div className="flex items-center gap-3">
              <img src={imageSrc(car.image)} alt={car.name} className="h-10 w-14 rounded object-cover" />
              <div>
                <p className="font-medium">{car.name}</p>
                <p className="text-xs text-muted-foreground">{car.slug}</p>
              </div>
            </div>
          ),
        },
        { key: "brand", label: "Брэнд" },
        {
          key: "price",
          label: "Үнэ",
          render: (car) => formatPrice(Number(car.price)),
        },
        {
          key: "status",
          label: "Төлөв",
          render: (car) => <Badge variant="secondary">{statusLabel[car.status] || car.status}</Badge>,
        },
        { key: "year", label: "Он" },
      ]}
    />
  );
}
