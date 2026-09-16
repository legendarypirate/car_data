"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CarCard } from "@/components/CarCard";
import { cars, type BodyType, type Car } from "@/data/cars";
import { fallbackBrands, fetchBrands, type Brand } from "@/lib/brands";

const categories = [
  { id: "all", label: "Бүх машин", icon: "all" },
  { id: "ev", label: "Цахилгаан (EV)", icon: "bolt" },
  { id: "suv", label: "SUV", icon: "suv" },
  { id: "sedan", label: "Седан", icon: "sedan" },
  { id: "mpv", label: "MPV", icon: "mpv" },
  { id: "hatchback", label: "Хэтчбек", icon: "hatchback" },
  { id: "pickup", label: "Пикап", icon: "pickup" },
  { id: "sport", label: "Спорт", icon: "sport" },
];

export function InventoryBrowser() {
  const params = useSearchParams();

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState(params.get("q") ?? "");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [showMoreBrands, setShowMoreBrands] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number>(300000000);
  const [selectedFuels, setSelectedFuels] = useState<string[]>([]);
  const [selectedDrivetrains, setSelectedDrivetrains] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [brands, setBrands] = useState<Brand[]>(fallbackBrands);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchBrands().then(setBrands);
  }, []);

  // Toggle brand selection
  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
    setCurrentPage(1);
  };

  // Toggle fuel selection
  const toggleFuel = (fuel: string) => {
    setSelectedFuels((prev) =>
      prev.includes(fuel) ? prev.filter((f) => f !== fuel) : [...prev, fuel]
    );
    setCurrentPage(1);
  };

  // Toggle drivetrain selection
  const toggleDrivetrain = (drive: string) => {
    setSelectedDrivetrains((prev) =>
      prev.includes(drive) ? prev.filter((d) => d !== drive) : [...prev, drive]
    );
    setCurrentPage(1);
  };

  // Reset filters
  const resetFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
    setSelectedBrands([]);
    setMaxPrice(300000000);
    setSelectedFuels([]);
    setSelectedDrivetrains([]);
    setSortBy("newest");
    setCurrentPage(1);
  };

  // Filtered cars
  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      // Category filter
      if (selectedCategory !== "all") {
        if (selectedCategory === "ev" && car.fuelType !== "EV") return false;
        if (selectedCategory === "suv" && car.type !== "SUV") return false;
        if (selectedCategory === "sedan" && car.type !== "Sedan") return false;
        if (selectedCategory === "mpv" && car.type !== "MPV") return false;
        if (selectedCategory === "hatchback" && car.type !== "Hatchback") return false;
        if (selectedCategory === "pickup" && car.type !== "Pickup") return false;
        if (selectedCategory === "sport" && car.type !== "Sport") return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matches =
          car.name.toLowerCase().includes(q) ||
          car.brand.toLowerCase().includes(q) ||
          car.color.toLowerCase().includes(q) ||
          (car.bodyLabel && car.bodyLabel.toLowerCase().includes(q));
        if (!matches) return false;
      }

      // Brand filter
      if (selectedBrands.length > 0 && !selectedBrands.includes(car.brand)) {
        return false;
      }

      // Price filter
      if (car.price > maxPrice) {
        return false;
      }

      // Fuel filter
      if (selectedFuels.length > 0) {
        const matchesFuel =
          (selectedFuels.includes("EV") && car.fuelType === "EV") ||
          (selectedFuels.includes("HEV") && car.fuelType === "HEV") ||
          (selectedFuels.includes("Petrol") && car.fuelType === "Petrol") ||
          (selectedFuels.includes("Diesel") && car.fuelType === "Diesel");
        if (!matchesFuel) return false;
      }

      // Drivetrain filter
      if (selectedDrivetrains.length > 0 && !selectedDrivetrains.includes(car.drivetrain)) {
        return false;
      }

      return true;
    });
  }, [
    selectedCategory,
    searchQuery,
    selectedBrands,
    maxPrice,
    selectedFuels,
    selectedDrivetrains,
  ]);

  // Sorted cars
  const sortedCars = useMemo(() => {
    const list = [...filteredCars];
    if (sortBy === "price-asc") {
      return list.sort((a, b) => a.price - b.price);
    }
    if (sortBy === "price-desc") {
      return list.sort((a, b) => b.price - a.price);
    }
    if (sortBy === "range-desc") {
      return list.sort((a, b) => b.rangeKm - a.rangeKm);
    }
    return list; // default / newest
  }, [filteredCars, sortBy]);

  // Pagination
  const totalPages = Math.ceil(sortedCars.length / itemsPerPage) || 1;
  const paginatedCars = sortedCars.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Dynamic Brand counts for the filter
  const brandCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    brands.forEach((b) => {
      counts[b.name] = b.carCount ?? cars.filter((c) => c.brand === b.name).length;
    });
    return counts;
  }, [brands]);

  return (
    <div className="w-full">
      {/* Category Icons Bar */}
      <div className="mb-10 w-full overflow-x-auto pb-2 scrollbar-none">
        <div className="flex min-w-[780px] items-center justify-between rounded-xl bg-white p-2 shadow-sm border border-[#e2e8f0]">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setCurrentPage(1);
                }}
                className={`flex flex-1 flex-col items-center justify-center gap-1.5 rounded-lg py-3 px-2 text-center transition-all ${
                  isActive
                    ? "bg-[#0c121d] text-white shadow-md"
                    : "text-[#475569] hover:bg-[#f8fafc] hover:text-[#0c121d]"
                }`}
              >
                {/* Icons */}
                <div className="h-5 w-5 flex items-center justify-center">
                  {cat.icon === "all" && (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
                      <circle cx="7" cy="17" r="2" />
                      <path d="M9 17h6" />
                      <circle cx="17" cy="17" r="2" />
                    </svg>
                  )}
                  {cat.icon === "bolt" && (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
                    </svg>
                  )}
                  {cat.icon === "suv" && (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M14 8h-4L6 12H3v4h2" />
                      <circle cx="7" cy="16" r="2" />
                      <path d="M9 16h6" />
                      <circle cx="17" cy="16" r="2" />
                      <path d="M19 16h2v-4l-3-4z" />
                    </svg>
                  )}
                  {cat.icon === "sedan" && (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 11 8 7h8l3 4h2v5h-2" />
                      <circle cx="7" cy="16" r="2" />
                      <path d="M9 16h6" />
                      <circle cx="17" cy="16" r="2" />
                      <path d="M5 16H3v-5h2" />
                    </svg>
                  )}
                  {cat.icon === "mpv" && (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 14V8c0-.6.4-1 1-1h11l4 5v3h-2" />
                      <circle cx="7" cy="16" r="2" />
                      <path d="M9 16h6" />
                      <circle cx="17" cy="16" r="2" />
                      <path d="M5 16H3v-2" />
                    </svg>
                  )}
                  {cat.icon === "hatchback" && (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 14V9l5-2h6l4 5v3h-2" />
                      <circle cx="7" cy="16" r="2" />
                      <path d="M9 16h6" />
                      <circle cx="17" cy="16" r="2" />
                      <path d="M5 16H3v-2" />
                    </svg>
                  )}
                  {cat.icon === "pickup" && (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 14V9l4-2h5v7h7v2h-2" />
                      <circle cx="6" cy="16" r="2" />
                      <path d="M8 16h7" />
                      <circle cx="17" cy="16" r="2" />
                      <path d="M4 16H2v-2" />
                    </svg>
                  )}
                  {cat.icon === "sport" && (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M6 3h12l4 6-10 12L2 9z" />
                    </svg>
                  )}
                </div>
                <span className="text-[12px] font-semibold whitespace-nowrap">
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Layout: Sidebar + Car Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr] xl:grid-cols-[280px_1fr]">
        {/* Left Filter Sidebar */}
        <aside className="flex flex-col gap-6">
          {/* Search Filter */}
          <div>
            <h3 className="mb-2.5 text-[14px] font-bold text-ink">Хайлт</h3>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Машины нэр, брэнд..."
                className="w-full rounded-lg border border-[#e2e8f0] bg-white py-2.5 pl-3.5 pr-9 text-[13px] text-ink placeholder-[#94a3b8] shadow-sm outline-none transition-all focus:border-[#0c121d] focus:ring-1 focus:ring-[#0c121d]"
              />
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8]"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>
          </div>

          {/* Brand Filter */}
          <div>
            <h3 className="mb-3 text-[14px] font-bold text-ink">Брэнд</h3>
            <div className="space-y-2.5">
              {brands.slice(0, showMoreBrands ? brands.length : 6).map((b) => (
                <label
                  key={b.id || b.name}
                  className="flex items-center justify-between text-[13px] text-[#334155] cursor-pointer hover:text-ink select-none"
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(b.name)}
                      onChange={() => toggleBrand(b.name)}
                      className="h-4 w-4 rounded border-[#cbd5e1] text-[#0c121d] accent-[#0c121d] focus:ring-0"
                    />
                    <span>{b.name}</span>
                  </div>
                  <span className="text-[12px] text-[#94a3b8]">
                    ({brandCounts[b.name] || 0})
                  </span>
                </label>
              ))}
            </div>

            {brands.length > 6 && (
              <button
                type="button"
                onClick={() => setShowMoreBrands(!showMoreBrands)}
                className="mt-3 flex items-center gap-1 text-[12px] font-semibold text-[#64748b] hover:text-ink"
              >
                <span>{showMoreBrands ? "Хураах" : "Бусад брэндүүд"}</span>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className={`transition-transform ${showMoreBrands ? "rotate-180" : ""}`}
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
            )}
          </div>

          {/* Price Range */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[14px] font-bold text-ink">Үнэ (₮)</h3>
            </div>
            <input
              type="range"
              min="50000000"
              max="300000000"
              step="5000000"
              value={maxPrice}
              onChange={(e) => {
                setMaxPrice(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="w-full accent-[#0c121d] h-1.5 bg-[#e2e8f0] rounded-lg appearance-none cursor-pointer"
            />
            <div className="mt-2 flex items-center justify-between text-[11px] font-medium text-[#64748b]">
              <span>50,000,000</span>
              <span>{maxPrice >= 300000000 ? "300,000,000+" : maxPrice.toLocaleString()}</span>
            </div>
          </div>

          {/* Fuel / Energy Filter */}
          <div>
            <h3 className="mb-3 text-[14px] font-bold text-ink">
              Түлш / Эрчим хүч
            </h3>
            <div className="space-y-2.5">
              {[
                { id: "EV", label: "Цахилгаан (EV)" },
                { id: "HEV", label: "Хайбрид (HEV)" },
                { id: "Petrol", label: "Бензин" },
                { id: "Diesel", label: "Дизель" },
              ].map((f) => (
                <label
                  key={f.id}
                  className="flex items-center gap-2.5 text-[13px] text-[#334155] cursor-pointer hover:text-ink select-none"
                >
                  <input
                    type="checkbox"
                    checked={selectedFuels.includes(f.id)}
                    onChange={() => toggleFuel(f.id)}
                    className="h-4 w-4 rounded border-[#cbd5e1] text-[#0c121d] accent-[#0c121d] focus:ring-0"
                  />
                  <span>{f.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Drivetrain Filter */}
          <div>
            <h3 className="mb-3 text-[14px] font-bold text-ink">Явах анги</h3>
            <div className="space-y-2.5">
              {[
                { id: "2WD", label: "2WD (Хоёр дугуй)" },
                { id: "AWD", label: "AWD (Бүх дугуй)" },
              ].map((d) => (
                <label
                  key={d.id}
                  className="flex items-center gap-2.5 text-[13px] text-[#334155] cursor-pointer hover:text-ink select-none"
                >
                  <input
                    type="checkbox"
                    checked={selectedDrivetrains.includes(d.id)}
                    onChange={() => toggleDrivetrain(d.id)}
                    className="h-4 w-4 rounded border-[#cbd5e1] text-[#0c121d] accent-[#0c121d] focus:ring-0"
                  />
                  <span>{d.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col gap-3">
            <button
              type="button"
              onClick={() => setCurrentPage(1)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0c121d] py-3 text-[13px] font-bold text-white shadow-md transition-all hover:bg-[#1e293b] active:scale-[0.98]"
            >
              <span>Хайлт хийх</span>
              <svg
                width="14"
                height="14"
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
            </button>

            <button
              type="button"
              onClick={resetFilters}
              className="text-center text-[12px] font-medium text-[#64748b] hover:text-ink underline transition-colors"
            >
              Шүүлтүүрийг цэвэрлэх
            </button>
          </div>
        </aside>

        {/* Right Content Area */}
        <section className="flex flex-col">
          {/* Top Bar: Count + Sort + Grid/List View Toggle */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <p className="text-[15px] font-bold text-ink">
              Нийт {sortedCars.length} машин байна
            </p>

            <div className="flex items-center gap-3">
              {/* Sort dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none rounded-lg border border-[#e2e8f0] bg-white py-2 pl-3 pr-8 text-[13px] font-medium text-ink shadow-sm outline-none transition-colors hover:border-[#cbd5e1] cursor-pointer"
                >
                  <option value="newest">Шинээр орсон</option>
                  <option value="price-asc">Үнэ: Багаас их</option>
                  <option value="price-desc">Үнэ: Ихээс бага</option>
                  <option value="range-desc">Туулах зай: Ихээс бага</option>
                </select>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#64748b]"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>

              {/* View Switcher Icons */}
              <div className="flex items-center rounded-lg border border-[#e2e8f0] bg-white p-0.5 shadow-sm">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  aria-label="Grid view"
                  className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors ${
                    viewMode === "grid"
                      ? "bg-[#0c121d] text-white"
                      : "text-[#64748b] hover:text-ink"
                  }`}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  aria-label="List view"
                  className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors ${
                    viewMode === "list"
                      ? "bg-[#0c121d] text-white"
                      : "text-[#64748b] hover:text-ink"
                  }`}
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="8" x2="21" y1="6" y2="6" />
                    <line x1="8" x2="21" y1="12" y2="12" />
                    <line x1="8" x2="21" y1="18" y2="18" />
                    <line x1="3" x2="3.01" y1="6" y2="6" />
                    <line x1="3" x2="3.01" y1="12" y2="12" />
                    <line x1="3" x2="3.01" y1="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Cars Grid / List */}
          {sortedCars.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#cbd5e1] bg-white py-16 px-6 text-center">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-[#94a3b8] mb-3"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <h4 className="text-[16px] font-bold text-ink">
                Тохирох машин олдсонгүй
              </h4>
              <p className="mt-1 text-[13px] text-[#64748b] max-w-sm">
                Та шүүлтүүрийн утгаа өөрчлөх эсвэл цэвэрлээд дахин хайна уу.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-4 rounded-lg bg-[#0c121d] px-4 py-2 text-[12px] font-semibold text-white transition-all hover:bg-[#1e293b]"
              >
                Шүүлтүүрийг цэвэрлэх
              </button>
            </div>
          ) : (
            <div
              className={`grid gap-5 ${
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1"
              }`}
            >
              {paginatedCars.map((car) => (
                <CarCard key={car.slug} car={car} />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {sortedCars.length > 0 && (
            <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-[#e2e8f0] pt-6">
              {/* Page Buttons */}
              <div className="flex items-center gap-1.5">
                {/* Previous */}
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#e2e8f0] bg-white text-[13px] text-[#64748b] transition-colors hover:border-[#0c121d] hover:text-ink disabled:opacity-40 disabled:pointer-events-none"
                >
                  ←
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNum) => (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setCurrentPage(pageNum)}
                      className={`flex h-9 min-w-[36px] px-3 items-center justify-center rounded-lg text-[13px] font-bold transition-all ${
                        currentPage === pageNum
                          ? "bg-[#0c121d] text-white shadow-sm"
                          : "border border-[#e2e8f0] bg-white text-[#64748b] hover:border-[#0c121d] hover:text-ink"
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                )}

                {/* Next */}
                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#e2e8f0] bg-white text-[13px] text-[#64748b] transition-colors hover:border-[#0c121d] hover:text-ink disabled:opacity-40 disabled:pointer-events-none"
                >
                  →
                </button>
              </div>

              {/* Showing stats */}
              <p className="text-[12px] font-medium text-[#64748b]">
                Нийт {sortedCars.length} машинаас{" "}
                {(currentPage - 1) * itemsPerPage + 1}-
                {Math.min(currentPage * itemsPerPage, sortedCars.length)} харуулж
                байна
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
