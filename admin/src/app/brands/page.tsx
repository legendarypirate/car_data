"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import { api, imageSrc } from "@/lib/api";
import type { Brand } from "@/lib/types";

export default function BrandsPage() {
  const router = useRouter();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      setBrands(await api<Brand[]>("/api/brands"));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Брэнд ачаалж чадсангүй");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function remove(brand: Brand) {
    if (!confirm(`${brand.name}-г устгах уу?`)) return;
    try {
      await api(`/api/brands/${brand.id}`, { method: "DELETE" });
      toast.success("Брэнд устгалаа");
      load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Устгаж чадсангүй");
    }
  }

  return (
    <DataTable
      rows={brands}
      loading={loading}
      emptyText="Брэнд олдсонгүй."
      searchPlaceholder="Брэндийн нэр хайх"
      searchKeys={["name", "slug"]}
      toolbar={
        <Button nativeButton={false} render={<Link href="/brands/new" />}>
          <Plus data-icon="inline-start" />
          Брэнд нэмэх
        </Button>
      }
      onEdit={(brand) => router.push(`/brands/${brand.id}`)}
      onDelete={remove}
      columns={[
        {
          key: "name",
          label: "Брэнд",
          render: (brand) => (
            <div className="flex items-center gap-3">
              <img src={imageSrc(brand.image)} alt={brand.name} className="h-10 w-14 rounded object-cover" />
              <p className="font-medium">{brand.name}</p>
            </div>
          ),
        },
        { key: "slug", label: "Слаг" },
        { key: "carCount", label: "Машин" },
      ]}
    />
  );
}
