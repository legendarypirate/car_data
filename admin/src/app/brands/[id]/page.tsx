"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { BrandForm } from "@/components/brand-form";
import { api } from "@/lib/api";
import type { Brand } from "@/lib/types";

export default function EditBrandPage() {
  const params = useParams<{ id: string }>();
  const [brand, setBrand] = useState<Brand | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api<Brand>(`/api/brands/${params.id}`)
      .then(setBrand)
      .catch((err: Error) => setError(err.message));
  }, [params.id]);

  if (error) {
    return <p className="text-sm text-destructive">{error}</p>;
  }
  if (!brand) {
    return <p className="text-sm text-muted-foreground">Брэнд ачаалж байна...</p>;
  }

  return (
    <div className="mx-auto max-w-3xl rounded-xl bg-white p-6 ring-1 ring-foreground/10">
      <h2 className="mb-6 text-xl font-semibold">{brand.name} засах</h2>
      <BrandForm brand={brand} />
    </div>
  );
}
