import Image from "next/image";
import Link from "next/link";
import type { Car } from "@/data/cars";
import { formatPrice } from "@/lib/format";
import { BrandLogo } from "@/components/BrandLogo";

export function CarCard({ car }: { car: Car }) {
  const badgeBg =
    car.badgeColor === "green" || car.badge === "Шинэ"
      ? "bg-[#10b981]"
      : car.badgeColor === "amber" || car.badge === "Хит"
      ? "bg-[#d97706]"
      : car.badgeColor === "slate" || car.badge === "Агуулахад"
      ? "bg-[#475569]"
      : "bg-[#10b981]";

  return (
    <Link
      href={`/inventory/${car.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white border border-[#e2e8f0] shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition-all duration-300 hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] hover:-translate-y-1"
    >
      {/* Image Area */}
      <div className="relative aspect-[16/11] w-full overflow-hidden bg-[#f1f5f9]">
        {/* Badge */}
        {car.badge && (
          <div className="absolute left-3 top-3 z-10">
            <span
              className={`inline-block rounded-[5px] ${badgeBg} px-2.5 py-0.5 text-[11px] font-semibold text-white shadow-sm`}
            >
              {car.badge}
            </span>
          </div>
        )}

        <Image
          src={car.image || "/hero-bg.jpg"}
          alt={`${car.brand} ${car.name}`}
          fill
          sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </div>

      {/* Content Area */}
      <div className="flex flex-1 flex-col p-4">
        {/* Header row: Brand logo + Arrow button */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="h-5 flex items-center">
              <BrandLogo brand={car.brand} />
            </div>
            <h3 className="mt-1 text-[15px] font-bold tracking-tight text-ink leading-snug">
              {car.name}
            </h3>
            <p className="text-[12px] text-[#64748b] leading-relaxed mt-0.5">
              {car.bodyLabel || (car.fuelType === "EV" ? "Цэвэр цахилгаан" : "Хайбрид") + " " + car.type}
            </p>
          </div>

          {/* Arrow Button */}
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0c121d] text-white transition-transform group-hover:translate-x-0.5 group-hover:bg-[#1e293b]">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </div>
        </div>

        {/* Price */}
        <div className="mt-2 text-[15px] font-extrabold text-ink tracking-tight">
          {formatPrice(car.price)}
          <span className="ml-1 text-[12px] font-normal text-[#64748b]"> - ээс</span>
        </div>

        {/* Specs Row */}
        <div className="mt-3 pt-2.5 border-t border-[#f1f5f9] flex items-center justify-between text-[11px] text-[#64748b]">
          {/* Range */}
          <div className="flex items-center gap-1.5 font-medium">
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[#94a3b8]"
            >
              <rect width="16" height="10" x="2" y="7" rx="2" ry="2" />
              <line x1="22" x2="22" y1="11" y2="13" />
              <line x1="6" x2="6" y1="11" y2="13" />
            </svg>
            <span>{car.rangeLabel || `${car.rangeKm} км (CLTC)`}</span>
          </div>

          {/* Power */}
          <div className="flex items-center gap-1.5 font-medium">
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[#94a3b8]"
            >
              <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            <span>{car.powerKw} кВт</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
