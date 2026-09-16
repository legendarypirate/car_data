"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { formatAmount, parseAmount } from "@/lib/format";
import { fetchCars } from "@/lib/cars";
import type { Car } from "@/data/cars";

const partnerBanks = [
  { name: "ХААН БАНК", color: "#166534", symbol: "🟢" },
  { name: "ГОЛОМТ БАНК", color: "#0284c7", symbol: "🔵" },
  { name: "ТӨРИЙН БАНК", color: "#0284c7", symbol: "🔷" },
  { name: "ХАСБАНК", color: "#dc2626", symbol: "🔶" },
  { name: "mobicom finance", color: "#dc2626", symbol: "🔴" },
  { name: "TDB LEASING", color: "#0369a1", symbol: "💎" },
];

const faqs = [
  {
    id: 1,
    q: "Ямар бичиг баримт шаардлагатай вэ?",
    a: "Иргэний үнэмлэх, сүүлийн 6 сарын нийгмийн даатгалын лавлагаа эсвэл бизнесийн орлого батлах дансны хуулга шаардлагатай.",
  },
  {
    id: 2,
    q: "Урьдчилгаа хамгийн багадаа хэд вэ?",
    a: "Харилцагчийн зээлийн түүх болон банкны нөхцөлөөс хамааран урьдчилгаа төлбөр 10%-иас эхэлнэ.",
  },
  {
    id: 3,
    q: "Хэд хоногт шийдвэр гардаг вэ?",
    a: "Материал бүрэн бүрдсэн тохиолдолд 1-3 ажлын өдөрт багтан зээлийн шийдвэр гарна.",
  },
  {
    id: 4,
    q: "Дахин санхүүжүүлэх боломжтой юу?",
    a: "Тийм, өмнөх зээлээ хаах, нөхцөлөө өөрчлөх, эсвэл дараагийн шинэ загвараар шинэчлэх боломжтой.",
  },
];

export function FinancingSection() {
  const [cars, setCars] = useState<Car[]>([]);
  const [selectedCarSlug, setSelectedCarSlug] = useState("");
  const [customPrice, setCustomPrice] = useState<number>(0);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(30);
  const [termMonths, setTermMonths] = useState<number>(36);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    fetchCars().then((list) => {
      setCars(list);
      if (list[0]) {
        setSelectedCarSlug(list[0].slug);
        setCustomPrice(list[0].price);
      }
    });
  }, []);

  // Handle Car Select
  const handleCarChange = (slug: string) => {
    setSelectedCarSlug(slug);
    const car = cars.find((c) => c.slug === slug);
    if (car) {
      setCustomPrice(car.price);
    }
  };

  // Monthly Payment Calculation
  const { downPaymentAmount, loanPrincipal, monthlyPayment } = useMemo(() => {
    const down = Math.round(customPrice * (downPaymentPercent / 100));
    const principal = Math.max(0, customPrice - down);

    // Approximate Mongolian auto lease monthly rate ~ 1.2% (14.4% p.a.)
    const monthlyRate = 0.012;
    const n = termMonths;
    let monthly = 0;

    if (principal > 0 && n > 0) {
      monthly = Math.round(
        (principal * (monthlyRate * Math.pow(1 + monthlyRate, n))) /
          (Math.pow(1 + monthlyRate, n) - 1)
      );
    }

    return {
      downPaymentAmount: down,
      loanPrincipal: principal,
      monthlyPayment: monthly,
    };
  }, [customPrice, downPaymentPercent, termMonths]);

  return (
    <div className="w-full space-y-16">
      {/* 2-Column: Calculator + 3 Financing Plans */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
        {/* Left Column: Calculator (5 cols) */}
        <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 lg:p-7 shadow-sm lg:col-span-5">
          <h2 className="text-xl font-bold tracking-tight text-ink">
            Санхүүжилтийн тооцоолуур
          </h2>
          <p className="mt-1 text-[13px] text-[#64748b]">
            Таны төлбөрийн урьдчилсан тооцоог эндээс хялбархан хийж үзээрэй.
          </p>

          <div className="mt-6 space-y-5">
            {/* Select Car */}
            <div>
              <label className="block text-[12px] font-semibold text-[#475569] mb-1.5">
                Машин сонгох
              </label>
              <div className="relative">
                <select
                  value={selectedCarSlug}
                  onChange={(e) => handleCarChange(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-[#e2e8f0] bg-white px-3.5 py-2.5 text-[13px] font-medium text-ink outline-none transition-all focus:border-[#0c121d] focus:ring-1 focus:ring-[#0c121d] cursor-pointer"
                >
                  {cars.slice(0, 10).map((car) => (
                    <option key={car.slug} value={car.slug}>
                      {car.name}
                    </option>
                  ))}
                </select>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8]"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>
            </div>

            {/* Car Price */}
            <div>
              <label className="block text-[12px] font-semibold text-[#475569] mb-1.5">
                Машины үнэ
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  value={formatAmount(customPrice)}
                  onChange={(e) => setCustomPrice(parseAmount(e.target.value))}
                  className="w-full rounded-lg border border-[#e2e8f0] bg-white px-3.5 py-2.5 pr-10 text-[13px] font-bold text-ink outline-none transition-all focus:border-[#0c121d] focus:ring-1 focus:ring-[#0c121d]"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[13px] font-bold text-[#64748b]">
                  ₮
                </span>
              </div>
            </div>

            {/* Down Payment Slider */}
            <div>
              <div className="flex items-center justify-between mb-1.5 text-[12px]">
                <span className="font-semibold text-[#475569]">Урьдчилгаа</span>
                <span className="font-bold text-ink font-mono">
                  {downPaymentPercent}% ({formatAmount(downPaymentAmount)}₮)
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="70"
                step="5"
                value={downPaymentPercent}
                onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                className="w-full accent-[#0c121d] h-1.5 bg-[#e2e8f0] rounded-lg appearance-none cursor-pointer"
              />
              <div className="mt-1.5 flex items-center justify-between text-[11px] text-[#94a3b8]">
                <span>10%</span>
                <span>70%</span>
              </div>
            </div>

            {/* Loan Term */}
            <div>
              <label className="block text-[12px] font-semibold text-[#475569] mb-1.5">
                Хугацаа
              </label>
              <div className="relative">
                <select
                  value={termMonths}
                  onChange={(e) => setTermMonths(Number(e.target.value))}
                  className="w-full appearance-none rounded-lg border border-[#e2e8f0] bg-white px-3.5 py-2.5 text-[13px] font-medium text-ink outline-none transition-all focus:border-[#0c121d] focus:ring-1 focus:ring-[#0c121d] cursor-pointer"
                >
                  <option value={12}>12 сар</option>
                  <option value={24}>24 сар</option>
                  <option value={36}>36 сар</option>
                  <option value={48}>48 сар</option>
                  <option value={60}>60 сар</option>
                  <option value={84}>84 сар</option>
                </select>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8]"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>
            </div>

            {/* Result Box */}
            <div className="mt-6 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-medium text-[#64748b]">
                  Сарын төлбөр (ойролцоогоор)
                </p>
                <p className="text-xl font-extrabold text-ink font-mono mt-0.5">
                  ₮ {formatAmount(monthlyPayment)}
                </p>
              </div>

              <Link
                href={`/contact?car=${selectedCarSlug}&type=financing`}
                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-[#0c121d] px-4 text-[12px] font-bold text-white shadow-sm transition-all hover:bg-[#1e293b]"
              >
                <span>Санхүүжилт хүсэх</span>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
            </div>

            <p className="text-[10px] text-[#94a3b8] leading-tight">
              *Тооцоолол нь жишиг бөгөөд банк болон ББСБ-ын нөхцөлөөс хамааран
              өөрчлөгдөх боломжтой.
            </p>
          </div>
        </div>

        {/* Right Column: 3 Plans (7 cols) */}
        <div className="lg:col-span-7">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-ink">
              Санхүүжилтийн төлөвлөгөө
            </h2>
            <p className="mt-1 text-[13px] text-[#64748b]">
              Таны хэрэгцээнд тохирсон уян хатан төлөвлөгөө
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Plan 1: Standard */}
            <div className="flex flex-col justify-between rounded-xl border border-[#e2e8f0] bg-white p-5 shadow-sm">
              <div>
                <h3 className="text-[15px] font-bold text-ink">Стандарт</h3>
                <p className="text-[11px] text-[#64748b] mt-0.5">
                  Тогтвортой, найдвартай
                </p>

                <div className="mt-4">
                  <span className="text-2xl font-extrabold text-ink font-mono">
                    20%
                  </span>
                  <span className="block text-[11px] text-[#64748b]">
                    Урьдчилгаа
                  </span>
                </div>

                <div className="mt-3">
                  <span className="text-[14px] font-bold text-ink">
                    12 – 36 сар
                  </span>
                  <span className="block text-[11px] text-[#64748b]">Хугацаа</span>
                </div>

                <ul className="mt-4 space-y-2 text-[12px] text-[#475569] border-t border-[#f1f5f9] pt-3">
                  <li className="flex items-center gap-1.5">
                    <span className="text-emerald-500 font-bold">✓</span> Тогтмол
                    сарын төлбөр
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="text-emerald-500 font-bold">✓</span> Ил тод
                    нөхцөл
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="text-emerald-500 font-bold">✓</span> Шуурхай
                    шийдвэр
                  </li>
                </ul>
              </div>

              <Link
                href="/contact"
                className="mt-6 flex h-8 items-center justify-center gap-1 rounded-lg border border-[#e2e8f0] text-[12px] font-semibold text-ink transition-colors hover:border-[#0c121d] hover:bg-[#f8fafc]"
              >
                <span>Дэлгэрэнгүй</span>
                <span>→</span>
              </Link>
            </div>

            {/* Plan 2: Flexible (Dark Featured) */}
            <div className="relative flex flex-col justify-between rounded-xl bg-[#0c121d] p-5 text-white shadow-md">
              <div className="absolute right-3 top-3">
                <span className="rounded bg-[#d97706] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                  Хамгийн түгээмэл
                </span>
              </div>

              <div>
                <h3 className="text-[15px] font-bold text-white">Уян хатан</h3>
                <p className="text-[11px] text-white/60 mt-0.5">
                  Таны боломжид нийцсэн
                </p>

                <div className="mt-4">
                  <span className="text-2xl font-extrabold text-white font-mono">
                    30%
                  </span>
                  <span className="block text-[11px] text-white/60">
                    Урьдчилгаа
                  </span>
                </div>

                <div className="mt-3">
                  <span className="text-[14px] font-bold text-white">
                    12 – 60 сар
                  </span>
                  <span className="block text-[11px] text-white/60">Хугацаа</span>
                </div>

                <ul className="mt-4 space-y-2 text-[12px] text-white/80 border-t border-white/10 pt-3">
                  <li className="flex items-center gap-1.5">
                    <span className="text-amber-400 font-bold">✓</span> Уян хатан
                    нөхцөл
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="text-amber-400 font-bold">✓</span> Бага сарын
                    төлбөр
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="text-amber-400 font-bold">✓</span> Олон
                    сонголттой
                  </li>
                </ul>
              </div>

              <Link
                href="/contact"
                className="mt-6 flex h-8 items-center justify-center gap-1 rounded-lg bg-white text-[12px] font-bold text-[#0c121d] transition-all hover:bg-white/90"
              >
                <span>Дэлгэрэнгүй</span>
                <span>→</span>
              </Link>
            </div>

            {/* Plan 3: Premium */}
            <div className="flex flex-col justify-between rounded-xl border border-[#e2e8f0] bg-white p-5 shadow-sm">
              <div>
                <h3 className="text-[15px] font-bold text-ink">Премиум</h3>
                <p className="text-[11px] text-[#64748b] mt-0.5">
                  Илүү тав тухтай
                </p>

                <div className="mt-4">
                  <span className="text-2xl font-extrabold text-ink font-mono">
                    50%
                  </span>
                  <span className="block text-[11px] text-[#64748b]">
                    Урьдчилгаа
                  </span>
                </div>

                <div className="mt-3">
                  <span className="text-[14px] font-bold text-ink">
                    12 – 84 сар
                  </span>
                  <span className="block text-[11px] text-[#64748b]">Хугацаа</span>
                </div>

                <ul className="mt-4 space-y-2 text-[12px] text-[#475569] border-t border-[#f1f5f9] pt-3">
                  <li className="flex items-center gap-1.5">
                    <span className="text-emerald-500 font-bold">✓</span> Бага
                    хүүтэй нөхцөл
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="text-emerald-500 font-bold">✓</span> Том
                    дүнгийн санхүүжилт
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="text-emerald-500 font-bold">✓</span> VIP
                    үйлчилгээ
                  </li>
                </ul>
              </div>

              <Link
                href="/contact"
                className="mt-6 flex h-8 items-center justify-center gap-1 rounded-lg border border-[#e2e8f0] text-[12px] font-semibold text-ink transition-colors hover:border-[#0c121d] hover:bg-[#f8fafc]"
              >
                <span>Дэлгэрэнгүй</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 4-Step Process Section */}
      <div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-ink">
            Санхүүжилт авах үйл явц
          </h2>
          <p className="mt-1 text-[13px] text-[#64748b]">Ердөө 4 алхамд</p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0c121d] text-white font-bold text-sm">
              1
            </div>
            <h3 className="mt-4 text-[15px] font-bold text-ink">
              Машинаа сонгох
            </h3>
            <p className="mt-1 text-[12px] text-[#64748b]">
              Вэбсайтаас эсвэл салонд
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0c121d] text-white font-bold text-sm">
              2
            </div>
            <h3 className="mt-4 text-[15px] font-bold text-ink">
              Хүсэлт илгээх
            </h3>
            <p className="mt-1 text-[12px] text-[#64748b]">
              Онлайн эсвэл салбарт
            </p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0c121d] text-white font-bold text-sm">
              3
            </div>
            <h3 className="mt-4 text-[15px] font-bold text-ink">
              Банкны баталгаажуулалт
            </h3>
            <p className="mt-1 text-[12px] text-[#64748b]">1–3 ажлын өдөр</p>
          </div>

          {/* Step 4 */}
          <div className="flex flex-col items-center text-center rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0c121d] text-white font-bold text-sm">
              4
            </div>
            <h3 className="mt-4 text-[15px] font-bold text-ink">
              Машинаа хүлээн авах
            </h3>
            <p className="mt-1 text-[12px] text-[#64748b]">
              Гэрээ байгуулж, жолоодорох
            </p>
          </div>
        </div>
      </div>

      {/* Partner Banks & Institutions */}
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight text-ink">
            Хамтрагч банкууд ба ББСБ
          </h2>
          <Link
            href="/contact"
            className="inline-flex items-center gap-1 text-[13px] font-semibold text-ink hover:underline"
          >
            <span>Бүх түншүүд</span>
            <span>→</span>
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {partnerBanks.map((bank, i) => (
            <div
              key={i}
              className="flex h-16 items-center justify-center rounded-xl border border-[#e2e8f0] bg-white p-3 text-center shadow-sm transition-all hover:shadow-md"
            >
              <span className="text-[13px] font-extrabold tracking-tight text-ink">
                {bank.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Accordion */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold tracking-tight text-ink">
            Түгээмэл асуултууд
          </h2>
          <Link
            href="/contact"
            className="inline-flex items-center gap-1 text-[13px] font-semibold text-ink hover:underline"
          >
            <span>Бусад асуултууд</span>
            <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {faqs.map((faq) => {
            const isOpen = openFaq === faq.id;
            return (
              <div
                key={faq.id}
                className="overflow-hidden rounded-xl border border-[#e2e8f0] bg-white transition-all shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                  className="flex w-full items-center justify-between p-4 text-left font-bold text-[14px] text-ink hover:text-brand transition-colors"
                >
                  <span>{faq.q}</span>
                  <span
                    className={`ml-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#f1f5f9] text-[16px] text-[#64748b] transition-transform ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </span>
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-[13px] text-[#64748b] leading-relaxed border-t border-[#f1f5f9]">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
