"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CarGalleryField } from "@/components/car-gallery-field";
import { CarTabsField } from "@/components/car-tabs-field";
import { defaultCarTabs, mergeCarTabs, type CarTabs } from "@/lib/car-tabs";
import { api, formatAmount, parseAmount } from "@/lib/api";
import type { Brand, Car } from "@/lib/types";

const emptyCar = {
  slug: "",
  name: "",
  brand: "",
  year: 2025,
  price: 0,
  type: "SUV",
  fuelType: "EV",
  drivetrain: "AWD",
  rangeKm: 0,
  rangeLabel: "",
  batteryKwh: "",
  powerKw: 0,
  acceleration: "",
  chargeMinutes: "",
  seats: 5,
  color: "",
  status: "in-stock",
  badge: "",
  badgeColor: "",
  eta: "",
  highlights: "",
  description: "",
  image: "",
  gallery: [] as string[],
  bodyLabel: "",
  featured: false,
  tabs: defaultCarTabs(),
};

type FormState = typeof emptyCar;

function fromCar(car?: Car): FormState {
  if (!car) return emptyCar;
  return {
    slug: car.slug,
    name: car.name,
    brand: car.brand,
    year: car.year,
    price: Number(car.price),
    type: car.type,
    fuelType: car.fuelType,
    drivetrain: car.drivetrain,
    rangeKm: car.rangeKm,
    rangeLabel: car.rangeLabel || "",
    batteryKwh: car.batteryKwh == null ? "" : String(car.batteryKwh),
    powerKw: car.powerKw,
    acceleration: car.acceleration,
    chargeMinutes: car.chargeMinutes == null ? "" : String(car.chargeMinutes),
    seats: car.seats,
    color: car.color,
    status: car.status,
    badge: car.badge || "",
    badgeColor: car.badgeColor || "",
    eta: car.eta || "",
    highlights: (car.highlights || []).join("\n"),
    description: car.description,
    image: car.image,
    gallery: car.gallery?.length ? car.gallery : car.image ? [car.image] : [],
    bodyLabel: car.bodyLabel || "",
    featured: car.featured,
    tabs: mergeCarTabs(car.tabs as CarTabs | undefined),
  };
}

const selectClass =
  "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function CarForm({ car }: { car?: Car }) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(() => fromCar(car));
  const [brands, setBrands] = useState<Brand[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api<Brand[]>("/api/brands")
      .then(setBrands)
      .catch(() => setBrands([]));
  }, []);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.image) {
      toast.error("Дор хаяж нэг зураг нэмнэ үү");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        year: Number(form.year),
        price: Number(form.price),
        rangeKm: Number(form.rangeKm),
        powerKw: Number(form.powerKw),
        seats: Number(form.seats),
        batteryKwh: form.batteryKwh === "" ? null : Number(form.batteryKwh),
        chargeMinutes: form.chargeMinutes === "" ? null : Number(form.chargeMinutes),
        gallery: form.gallery.length ? form.gallery : form.image ? [form.image] : [],
      };
      if (car) {
        await api(`/api/cars/${car.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        toast.success("Машин шинэчлэгдлээ");
      } else {
        await api("/api/cars", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        toast.success("Машин нэмэгдлээ");
      }
      router.push("/cars");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Хадгалж чадсангүй");
    } finally {
      setSaving(false);
    }
  }

  const actions = (
    <div className="flex gap-2">
      <Button type="submit" disabled={saving}>
        {saving ? "Хадгалж байна..." : car ? "Машин шинэчлэх" : "Машин үүсгэх"}
      </Button>
      <Button type="button" variant="outline" onClick={() => router.push("/cars")}>
        Болих
      </Button>
    </div>
  );

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">{car ? `${car.name} засах` : "Машин нэмэх"}</h2>
          <p className="text-sm text-muted-foreground">
            Зураг, мэдээлэл, үзүүлэлт болон заруудын тохиргоо.
          </p>
        </div>
        {actions}
      </div>

      <Section title="Зургууд" description="Олон зураг нэмнэ үү. Одтой зураг нь нүүр зураг болно.">
        <div className="col-span-full">
          <CarGalleryField
            cover={form.image}
            gallery={form.gallery}
            onChange={({ image, gallery }) =>
              setForm((current) => ({ ...current, image, gallery }))
            }
          />
        </div>
      </Section>

      <Section title="Үндсэн мэдээлэл" description="Нэр болон жагсаалтын мэдээлэл.">
        <Field label="Нэр">
          <Input required value={form.name} onChange={(e) => update("name", e.target.value)} />
        </Field>
        <Field label="Брэнд">
          <select
            required
            className={selectClass}
            value={form.brand}
            onChange={(e) => update("brand", e.target.value)}
          >
            <option value="">Брэнд сонгох</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.name}>
                {brand.name}
              </option>
            ))}
            {form.brand && !brands.some((brand) => brand.name === form.brand) && (
              <option value={form.brand}>{form.brand}</option>
            )}
          </select>
        </Field>
        <Field label="Слаг">
          <Input value={form.slug} onChange={(e) => update("slug", e.target.value)} placeholder="Хоосон бол автоматаар үүснэ" />
        </Field>
        <Field label="Он">
          <Input type="number" required value={form.year} onChange={(e) => update("year", Number(e.target.value))} />
        </Field>
        <Field label="Үнэ (₮)">
          <Input
            required
            inputMode="numeric"
            value={formatAmount(form.price)}
            onChange={(e) => update("price", parseAmount(e.target.value))}
          />
        </Field>
        <Field label="Өнгө">
          <Input required value={form.color} onChange={(e) => update("color", e.target.value)} />
        </Field>
      </Section>

      <Section title="Үзүүлэлт" description="Бие, хөдөлгүүр, туулах зай.">
        <Field label="Төрөл">
          <select className={selectClass} value={form.type} onChange={(e) => update("type", e.target.value)}>
            <option value="SUV">SUV</option>
            <option value="Sedan">Седан</option>
            <option value="MPV">MPV</option>
            <option value="Hatchback">Хэтчбек</option>
            <option value="Pickup">Пикап</option>
            <option value="Sport">Спорт</option>
            <option value="EV">Цахилгаан</option>
          </select>
        </Field>
        <Field label="Түлш">
          <select className={selectClass} value={form.fuelType} onChange={(e) => update("fuelType", e.target.value)}>
            <option value="EV">Цахилгаан (EV)</option>
            <option value="HEV">Хайбрид (HEV)</option>
            <option value="Petrol">Бензин</option>
            <option value="Diesel">Дизель</option>
          </select>
        </Field>
        <Field label="Хөтлөгч">
          <select className={selectClass} value={form.drivetrain} onChange={(e) => update("drivetrain", e.target.value)}>
            <option value="2WD">2WD</option>
            <option value="AWD">AWD</option>
          </select>
        </Field>
        <Field label="Суудал">
          <Input type="number" required value={form.seats} onChange={(e) => update("seats", Number(e.target.value))} />
        </Field>
        <Field label="Туулах зай (км)">
          <Input type="number" required value={form.rangeKm} onChange={(e) => update("rangeKm", Number(e.target.value))} />
        </Field>
        <Field label="Зайны тайлбар">
          <Input value={form.rangeLabel} onChange={(e) => update("rangeLabel", e.target.value)} />
        </Field>
        <Field label="Батарей (кВт.ц)">
          <Input value={form.batteryKwh} onChange={(e) => update("batteryKwh", e.target.value)} />
        </Field>
        <Field label="Хүчин чадал (кВт)">
          <Input type="number" required value={form.powerKw} onChange={(e) => update("powerKw", Number(e.target.value))} />
        </Field>
        <Field label="Хурдатгал">
          <Input required value={form.acceleration} onChange={(e) => update("acceleration", e.target.value)} placeholder="7.5 с" />
        </Field>
        <Field label="Цэнэглэх минут">
          <Input value={form.chargeMinutes} onChange={(e) => update("chargeMinutes", e.target.value)} />
        </Field>
        <Field label="Төрлийн тайлбар">
          <Input value={form.bodyLabel} onChange={(e) => update("bodyLabel", e.target.value)} />
        </Field>
      </Section>

      <Section title="Зар" description="Сайт дээр хэрхэн харагдахыг тохируулна.">
        <Field label="Төлөв">
          <select className={selectClass} value={form.status} onChange={(e) => update("status", e.target.value)}>
            <option value="in-stock">Агуулахад</option>
            <option value="in-transit">Тээвэрт</option>
            <option value="order">Захиалга</option>
          </select>
        </Field>
        <Field label="Тэмдэг">
          <Input value={form.badge} onChange={(e) => update("badge", e.target.value)} />
        </Field>
        <Field label="Тэмдгийн өнгө">
          <Input value={form.badgeColor} onChange={(e) => update("badgeColor", e.target.value)} placeholder="green / amber / slate" />
        </Field>
        <Field label="Хүлээгдэх хугацаа">
          <Input value={form.eta} onChange={(e) => update("eta", e.target.value)} />
        </Field>
        <label className="flex items-center gap-2 self-end pb-1 text-sm">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => update("featured", e.target.checked)}
          />
          Нүүр хуудсанд онцлох
        </label>
      </Section>

      <Section title="Тайлбар" description="Нийтийн хуудсанд харагдах текст." columns={2}>
        <Field label="Онцлох (мөр бүр нэг)">
          <Textarea rows={5} value={form.highlights} onChange={(e) => update("highlights", e.target.value)} />
        </Field>
        <Field label="Тайлбар">
          <Textarea rows={5} required value={form.description} onChange={(e) => update("description", e.target.value)} />
        </Field>
      </Section>

      <Section title="Хуудасны табууд" description="Онцлох, дизайн, интерьер, технологи, үзүүлэлт, галлерей.">
        <div className="col-span-full">
          <CarTabsField
            tabs={form.tabs}
            gallery={form.gallery}
            carInfo={{
              year: Number(form.year),
              type: form.type,
              fuelType: form.fuelType,
              drivetrain: form.drivetrain,
              seats: Number(form.seats),
              color: form.color,
              powerKw: Number(form.powerKw),
              acceleration: form.acceleration,
              rangeKm: Number(form.rangeKm),
              rangeLabel: form.rangeLabel,
              batteryKwh: form.batteryKwh,
              chargeMinutes: form.chargeMinutes,
            }}
            onChange={(tabs) => update("tabs", tabs)}
          />
        </div>
      </Section>

      <div className="sticky bottom-0 z-10 flex justify-end rounded-xl bg-white/90 p-4 ring-1 ring-foreground/10 backdrop-blur">
        {actions}
      </div>
    </form>
  );
}

function Section({
  title,
  description,
  children,
  columns = 4,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  columns?: 2 | 4;
}) {
  return (
    <section className="rounded-xl bg-white p-6 ring-1 ring-foreground/10">
      <div className="mb-5">
        <h3 className="text-base font-semibold">{title}</h3>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      <div className={columns === 2 ? "grid gap-4 md:grid-cols-2" : "grid gap-4 sm:grid-cols-2 xl:grid-cols-4"}>
        {children}
      </div>
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-1.5">
      <Label>{label}</Label>
      {children}
    </label>
  );
}
