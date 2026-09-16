"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fallbackBrands, fetchBrands } from "@/lib/brands";

export function HomeSearch() {
  const router = useRouter();
  const [brands, setBrands] = useState(fallbackBrands);

  useEffect(() => {
    fetchBrands().then(setBrands);
  }, []);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const params = new URLSearchParams();
    for (const key of ["q", "brand", "type", "status"]) {
      const value = String(data.get(key) ?? "");
      if (value && value !== "All") params.set(key, value);
    }
    router.push(`/inventory?${params.toString()}`);
  }

  return (
    <form
      onSubmit={onSubmit}
      className="grid gap-3 rounded-xl bg-white p-4 shadow-[0_12px_40px_rgba(15,23,42,0.12)] sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1fr_auto]"
    >
      <input
        name="q"
        placeholder="Toyota, Tesla, цахилгаан…"
        className="h-11 rounded-lg border border-line px-3 text-sm outline-none focus:border-brand"
      />
      <select
        name="brand"
        defaultValue="All"
        className="h-11 rounded-lg border border-line bg-white px-3 text-sm"
      >
        <option value="All">Бүх брэнд</option>
        {brands.map((brand) => (
          <option key={brand.id || brand.name}>{brand.name}</option>
        ))}
      </select>
      <select
        name="type"
        defaultValue="All"
        className="h-11 rounded-lg border border-line bg-white px-3 text-sm"
      >
        <option value="All">Бүх төрөл</option>
        <option>Sedan</option>
        <option>SUV</option>
        <option>Shooting brake</option>
        <option>MPV</option>
      </select>
      <select
        name="status"
        defaultValue="All"
        className="h-11 rounded-lg border border-line bg-white px-3 text-sm"
      >
        <option value="All">Бүх төлөв</option>
        <option value="in-stock">Бэлэн байгаа</option>
        <option value="in-transit">Тээвэрлэж байгаа</option>
        <option value="order">Захиалга</option>
      </select>
      <button
        type="submit"
        className="h-11 rounded-lg bg-brand px-5 text-sm font-semibold text-white hover:bg-brand-dark"
      >
        Хайх
      </button>
    </form>
  );
}
