"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { BrandImageField } from "@/components/brand-image-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import type { Brand } from "@/lib/types";

export function BrandForm({ brand }: { brand?: Brand }) {
  const router = useRouter();
  const [name, setName] = useState(brand?.name || "");
  const [image, setImage] = useState(brand?.image || "");
  const [saving, setSaving] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim()) {
      toast.error("Брэндийн нэр оруулна уу");
      return;
    }
    if (!image.trim()) {
      toast.error("Брэндийн зураг нэмнэ үү");
      return;
    }
    setSaving(true);
    try {
      const payload = { name: name.trim(), image: image.trim() };
      if (brand) {
        await api(`/api/brands/${brand.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        toast.success("Брэнд шинэчлэгдлээ");
      } else {
        await api("/api/brands", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        toast.success("Брэнд нэмэгдлээ");
      }
      router.push("/brands");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Хадгалж чадсангүй");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <label className="grid max-w-md gap-1.5">
        <Label>Нэр</Label>
        <Input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Toyota" />
      </label>

      <BrandImageField value={image} onChange={setImage} />

      <div className="flex gap-2">
        <Button type="submit" disabled={saving}>
          {saving ? "Хадгалж байна..." : brand ? "Брэнд шинэчлэх" : "Брэнд үүсгэх"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/brands")}>
          Болих
        </Button>
      </div>
    </form>
  );
}
