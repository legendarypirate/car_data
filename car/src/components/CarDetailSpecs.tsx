"use client";

import Image from "next/image";
import Link from "next/link";
import type { Car } from "@/data/cars";
import { mergeCarTabs, resolvedSpecs } from "@/lib/car-tabs";

export function CarDetailSpecs({ car }: { car: Car }) {
  const tabs = mergeCarTabs(car.tabs);
  const { metrics, groups } = resolvedSpecs(car, tabs);
  const photos = (car.gallery?.length ? car.gallery : [car.image]).filter(Boolean).slice(0, 3);

  return (
    <div className="space-y-10">
      <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm lg:p-8">
        <div className="border-b border-[#f1f5f9] pb-6">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#64748b]">
            {tabs.specs.label || "ТЕХНИКИЙН ҮЗҮҮЛЭЛТ"}
          </span>
          <h2 className="mt-1 text-2xl font-extrabold text-ink lg:text-3xl">
            {tabs.specs.title || car.name}
          </h2>
          {(tabs.specs.intro || tabs.specs.subtitle) && (
            <p className="mt-1 text-[13px] text-[#64748b]">{tabs.specs.intro || tabs.specs.subtitle}</p>
          )}
        </div>

        {metrics.length > 0 && (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {metrics.map((item) => (
              <div key={`${item.label}-${item.value}`} className="flex items-center gap-3">
                <div>
                  <span className="block font-mono text-xl font-extrabold text-ink">{item.value}</span>
                  <span className="text-[11px] text-[#64748b]">{item.label}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
        <div className="space-y-8">
          {groups.map((group) => (
            <div key={group.title} className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
              <h3 className="mb-4 border-b border-[#f1f5f9] pb-3 text-[16px] font-bold text-ink">
                {group.title}
              </h3>
              <div className="space-y-3 text-[13px]">
                {(group.rows || [])
                  .filter((row) => row.label || row.value)
                  .map((row) => (
                    <div
                      key={`${row.label}-${row.value}`}
                      className="flex justify-between border-b border-[#f8fafc] py-1 last:border-0"
                    >
                      <span className="text-[#64748b]">{row.label}</span>
                      <span className="font-bold text-ink">{row.value}</span>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-8">
          {photos.length > 0 && (
            <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
              <h3 className="mb-4 border-b border-[#f1f5f9] pb-3 text-[16px] font-bold text-ink">Зураг</h3>
              <div className="grid grid-cols-2 gap-4">
                {photos.map((src, index) => (
                  <div
                    key={`${src}-${index}`}
                    className={`relative overflow-hidden rounded-lg border border-[#e2e8f0] bg-[#f8fafc] ${
                      index === 2 ? "col-span-2 aspect-[16/8]" : "aspect-[4/3]"
                    }`}
                  >
                    <Image src={src} alt={car.name} fill className="object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-[#0c121d] p-8 text-white shadow-xl md:flex-row md:items-center">
        <div>
          <h3 className="text-2xl font-extrabold text-white">{car.name}-ийг өөрийн нүдээр мэдрээрэй</h3>
          <p className="mt-1 text-sm text-white/70">
            Тест драйв захиалаад, энэ загварыг биеэр үзээрэй.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Link
              href={`/contact?car=${car.slug}&type=testdrive`}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-white px-5 text-[13px] font-bold text-[#0c121d] hover:bg-white/90"
            >
              Тест драйв захиалах →
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 text-[13px] font-medium text-white hover:bg-white/10"
            >
              Холбоо барих →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
