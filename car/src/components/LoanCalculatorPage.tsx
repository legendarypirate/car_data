"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { fetchCars } from "@/lib/cars";
import { formatAmount, formatPrice, parseAmount } from "@/lib/format";
import {
  calculateLoan,
  DEFAULT_ANNUAL_RATE,
  DEFAULT_DOWN_PERCENT,
  DEFAULT_TERM_MONTHS,
  khanBankContactHref,
  LOAN_TERM_OPTIONS,
} from "@/lib/loan";
import type { Car } from "@/data/cars";

function readNumber(value: string | null, fallback: number) {
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function LoanCalculatorPage() {
  const searchParams = useSearchParams();
  const [cars, setCars] = useState<Car[]>([]);
  const [selectedCarSlug, setSelectedCarSlug] = useState("");
  const [price, setPrice] = useState(0);
  const [downPercent, setDownPercent] = useState(
    readNumber(searchParams.get("down"), DEFAULT_DOWN_PERCENT)
  );
  const [termMonths, setTermMonths] = useState(
    readNumber(searchParams.get("term"), DEFAULT_TERM_MONTHS)
  );
  const [annualRate, setAnnualRate] = useState(
    readNumber(searchParams.get("rate"), DEFAULT_ANNUAL_RATE)
  );

  useEffect(() => {
    fetchCars().then((list) => {
      setCars(list);
      const param = searchParams.get("car") || "";
      const paramPrice = readNumber(searchParams.get("price"), 0);
      const match = list.find((car) => car.slug === param || car.uuid === param);

      if (match) {
        setSelectedCarSlug(match.slug);
        setPrice(paramPrice > 0 ? paramPrice : match.price);
      } else if (list[0]) {
        setSelectedCarSlug(list[0].slug);
        setPrice(paramPrice > 0 ? paramPrice : list[0].price);
      } else if (paramPrice > 0) {
        setPrice(paramPrice);
      }
    });
  }, [searchParams]);

  const handleCarChange = (slug: string) => {
    setSelectedCarSlug(slug);
    const car = cars.find((item) => item.slug === slug);
    if (car) setPrice(car.price);
  };

  const calculation = useMemo(
    () =>
      calculateLoan({
        price,
        downPercent,
        termMonths,
        annualRate,
      }),
    [price, downPercent, termMonths, annualRate]
  );

  const contactHref = khanBankContactHref({
    car: selectedCarSlug,
    price,
    downPercent,
    termMonths,
    monthly: calculation.monthlyPayment,
    rate: annualRate,
  });

  return (
    <div className="w-full space-y-10">
      <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm lg:p-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
          <div className="space-y-5 lg:col-span-5">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-ink">
                Зээлийн тооцоолуур
              </h2>
              <p className="mt-1 text-[13px] text-[#64748b]">
                Машины үнэ, урьдчилгаа, хүү, хугацааг тохируулан сарын төлбөрөө
                урьдчилан тооцоолно.
              </p>
            </div>

            <div>
              <label className="mb-1.5 block text-[12px] font-semibold text-[#475569]">
                Загвар сонгох
              </label>
              <select
                value={selectedCarSlug}
                onChange={(e) => handleCarChange(e.target.value)}
                className="w-full cursor-pointer appearance-none rounded-lg border border-[#e2e8f0] bg-white px-3.5 py-2.5 text-[13px] font-medium text-ink outline-none transition-all focus:border-[#003da5] focus:ring-1 focus:ring-[#003da5]"
              >
                {cars.map((car) => (
                  <option key={car.slug} value={car.slug}>
                    {car.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-[12px] font-semibold text-[#475569]">
                Машины үнэ
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  value={formatAmount(price)}
                  onChange={(e) => setPrice(parseAmount(e.target.value))}
                  className="w-full rounded-lg border border-[#e2e8f0] bg-white px-3.5 py-2.5 pr-10 text-[13px] font-bold text-ink outline-none transition-all focus:border-[#003da5] focus:ring-1 focus:ring-[#003da5]"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[13px] font-bold text-[#64748b]">
                  ₮
                </span>
              </div>
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between text-[12px]">
                <span className="font-semibold text-[#475569]">Урьдчилгаа хувь</span>
                <span className="font-bold font-mono text-ink">
                  {downPercent}% ({formatAmount(calculation.downPaymentAmount)}₮)
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="70"
                step="5"
                value={downPercent}
                onChange={(e) => setDownPercent(Number(e.target.value))}
                className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-[#e2e8f0] accent-[#003da5]"
              />
              <div className="mt-1.5 flex items-center justify-between text-[11px] text-[#94a3b8]">
                <span>10%</span>
                <span>70%</span>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-[12px] font-semibold text-[#475569]">
                Зээлийн хүү (жилээр)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="30"
                  step="0.1"
                  value={annualRate}
                  onChange={(e) => setAnnualRate(Number(e.target.value) || DEFAULT_ANNUAL_RATE)}
                  className="w-full rounded-lg border border-[#e2e8f0] bg-white px-3.5 py-2.5 pr-10 text-[13px] font-medium text-ink outline-none transition-all focus:border-[#003da5] focus:ring-1 focus:ring-[#003da5]"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[13px] font-bold text-[#64748b]">
                  %
                </span>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-[12px] font-semibold text-[#475569]">
                Зээл төлж дуусах хугацаа
              </label>
              <select
                value={termMonths}
                onChange={(e) => setTermMonths(Number(e.target.value))}
                className="w-full cursor-pointer appearance-none rounded-lg border border-[#e2e8f0] bg-white px-3.5 py-2.5 text-[13px] font-medium text-ink outline-none transition-all focus:border-[#003da5] focus:ring-1 focus:ring-[#003da5]"
              >
                {LOAN_TERM_OPTIONS.map((months) => (
                  <option key={months} value={months}>
                    {months} сар ({Math.round(months / 12)} жил)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-2xl bg-[#003da5] p-6 text-white shadow-md lg:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/70">
                    Хаан банк
                  </p>
                  <h3 className="mt-1 text-[22px] font-bold tracking-tight">
                    Таны зээлийн тооцоолол
                  </h3>
                </div>
                <span className="rounded-lg bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider">
                  Khan Bank
                </span>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl bg-white/10 p-4">
                  <p className="text-[11px] text-white/70">Сар бүрийн төлбөр</p>
                  <p className="mt-1 font-mono text-2xl font-extrabold">
                    {formatPrice(calculation.monthlyPayment)}
                  </p>
                </div>
                <div className="rounded-xl bg-white/10 p-4">
                  <p className="text-[11px] text-white/70">Урьдчилгаа төлбөр</p>
                  <p className="mt-1 font-mono text-xl font-extrabold">
                    {formatPrice(calculation.downPaymentAmount)}
                  </p>
                </div>
                <div className="rounded-xl bg-white/10 p-4">
                  <p className="text-[11px] text-white/70">Зээлийн хэмжээ</p>
                  <p className="mt-1 font-mono text-xl font-extrabold">
                    {formatPrice(calculation.loanPrincipal)}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-3 border-t border-white/15 pt-6 text-[13px] sm:grid-cols-2">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-white/70">Нийт хүү</span>
                  <span className="font-semibold">{formatPrice(calculation.totalInterest)}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-white/70">Нийт төлбөр</span>
                  <span className="font-semibold">{formatPrice(calculation.totalPayment)}</span>
                </div>
              </div>

              <Link
                href={contactHref}
                className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-white text-[13px] font-bold text-[#003da5] transition-colors hover:bg-white/90"
              >
                Хаан банкны зээл судлуулах
                <span>→</span>
              </Link>
            </div>

            <p className="mt-4 text-[11px] leading-relaxed text-[#94a3b8]">
              *Тооцоолол нь жишиг бөгөөд Хаан банкны бодит нөхцөл, хүү, шимтгэлээс
              хамааран өөрчлөгдөх боломжтой.
            </p>
          </div>
        </div>
      </div>

      {calculation.schedule.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-sm">
          <div className="border-b border-[#f1f5f9] px-6 py-4">
            <h3 className="text-[16px] font-bold text-ink">Эргэн төлөлтийн хуваарь</h3>
            <p className="mt-1 text-[12px] text-[#64748b]">
              Сар бүрийн төлбөр, бодогдсон хүү, үндсэн зээлийн төлөлт
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-[13px]">
              <thead className="bg-[#f8fafc] text-[11px] uppercase tracking-wider text-[#64748b]">
                <tr>
                  <th className="px-4 py-3 font-semibold">№</th>
                  <th className="px-4 py-3 font-semibold">Сарын төлөлт</th>
                  <th className="px-4 py-3 font-semibold">Бодогдсон хүү</th>
                  <th className="px-4 py-3 font-semibold">Үндсэн зээл</th>
                  <th className="px-4 py-3 font-semibold">Зээлийн үлдэгдэл</th>
                </tr>
              </thead>
              <tbody>
                {calculation.schedule.map((row) => (
                  <tr key={row.month} className="border-t border-[#f1f5f9]">
                    <td className="px-4 py-3 font-medium text-ink">{row.month}</td>
                    <td className="px-4 py-3 font-mono">{formatAmount(row.payment)}₮</td>
                    <td className="px-4 py-3 font-mono text-[#64748b]">
                      {formatAmount(row.interest)}₮
                    </td>
                    <td className="px-4 py-3 font-mono">{formatAmount(row.principal)}₮</td>
                    <td className="px-4 py-3 font-mono">{formatAmount(row.balance)}₮</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
