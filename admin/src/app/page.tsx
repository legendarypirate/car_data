"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  CarFront,
  Clock3,
  PackageCheck,
  ShoppingCart,
  Tags,
  Wallet,
} from "lucide-react";
import { api, formatPrice } from "@/lib/api";
import type { Stats } from "@/lib/types";

const emptyStats: Stats = {
  totalCars: 0,
  inStock: 0,
  inTransit: 0,
  onOrder: 0,
  inquiries: 0,
  inventoryValue: 0,
  brands: [],
};

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>(emptyStats);
  const [error, setError] = useState("");

  useEffect(() => {
    api<Stats>("/api/stats")
      .then(setStats)
      .catch((err: Error) => setError(err.message));
  }, []);

  const cards = [
    { label: "Нийт машин", value: stats.totalCars, icon: CarFront, tone: "bg-[#0c121d] text-white" },
    { label: "Агуулахад", value: stats.inStock, icon: PackageCheck, tone: "bg-emerald-50 text-emerald-700" },
    { label: "Тээвэрт", value: stats.inTransit, icon: Clock3, tone: "bg-amber-50 text-amber-700" },
    { label: "Захиалга", value: stats.onOrder, icon: ShoppingCart, tone: "bg-sky-50 text-sky-700" },
    { label: "Хүсэлт", value: stats.inquiries, icon: Wallet, tone: "bg-rose-50 text-rose-700" },
  ];

  const maxBrand = Math.max(1, ...stats.brands.map((item) => item.count));
  const chart = useMemo(() => buildChart(stats.brands.map((item) => item.count)), [stats.brands]);

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          Статистик ачаалж чадсангүй. Backend 4001 порт дээр ажиллаж байна уу? {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded-2xl bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)] ring-1 ring-black/5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{card.label}</p>
                <span className={`grid size-9 place-items-center rounded-xl ${card.tone}`}>
                  <Icon className="size-4" />
                </span>
              </div>
              <p className="mt-4 text-3xl font-semibold tracking-tight">{card.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.04)] ring-1 ring-black/5">
          <p className="text-sm text-muted-foreground">Барааны үнэ</p>
          <p className="mt-2 text-4xl font-semibold tracking-tight">{formatPrice(stats.inventoryValue)}</p>
          <p className="mt-2 text-sm text-muted-foreground">Бүх машины жагсаалтын нийлбэр үнэ.</p>
          <div className="mt-8">
            <svg viewBox="0 0 360 120" className="h-32 w-full">
              <defs>
                <linearGradient id="valueFill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#0c121d" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#0c121d" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={chart.area} fill="url(#valueFill)" />
              <path d={chart.line} fill="none" stroke="#0c121d" strokeWidth="3" strokeLinecap="round" />
              {chart.dots.map((dot, index) => (
                <circle key={index} cx={dot.x} cy={dot.y} r="3.5" fill="#0c121d" />
              ))}
            </svg>
            <div className="mt-1 flex justify-between text-[11px] text-muted-foreground">
              {stats.brands.slice(0, 6).map((item) => (
                <span key={item.brand}>{item.brand}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.04)] ring-1 ring-black/5">
          <p className="text-sm text-muted-foreground">Брэндээр</p>
          <div className="mt-5 space-y-4">
            {stats.brands.length === 0 && (
              <p className="text-sm text-muted-foreground">Машин алга.</p>
            )}
            {stats.brands.map((item) => (
              <div key={item.brand}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span>{item.brand}</span>
                  <span className="font-medium">{item.count}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[#eef2f6]">
                  <div
                    className="h-full rounded-full bg-[#0c121d]"
                    style={{ width: `${Math.max(8, (item.count / maxBrand) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Link href="/cars" className="rounded-2xl bg-[#0c121d] px-5 py-4 text-white shadow-[0_8px_24px_rgba(15,23,42,0.12)]">
          <CarFront className="size-5" />
          <p className="mt-3 font-semibold">Машин удирдах</p>
          <p className="mt-1 text-sm text-white/60">Бараа, зураг, таб</p>
        </Link>
        <Link href="/brands" className="rounded-2xl bg-white px-5 py-4 ring-1 ring-black/5">
          <Tags className="size-5" />
          <p className="mt-3 font-semibold">Брэнд удирдах</p>
          <p className="mt-1 text-sm text-muted-foreground">Нэр, лого, зураг</p>
        </Link>
        <Link href="/inquiries" className="rounded-2xl bg-white px-5 py-4 ring-1 ring-black/5">
          <Wallet className="size-5" />
          <p className="mt-3 font-semibold">Хүсэлт үзэх</p>
          <p className="mt-1 text-sm text-muted-foreground">Шинэ захиалга, холбоо</p>
        </Link>
      </div>
    </div>
  );
}

function buildChart(values: number[]) {
  const points = values.length ? values : [2, 4, 3, 6, 5, 7];
  const max = Math.max(...points, 1);
  const width = 360;
  const height = 120;
  const step = width / Math.max(points.length - 1, 1);
  const coords = points.map((value, index) => ({
    x: index * step,
    y: height - 16 - (value / max) * 84,
  }));
  const line = coords.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
  const area = `${line} L ${coords[coords.length - 1].x} ${height} L 0 ${height} Z`;
  return { line, area, dots: coords };
}
