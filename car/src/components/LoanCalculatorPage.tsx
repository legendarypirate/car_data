"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { fetchCars } from "@/lib/cars";
import { formatAmount } from "@/lib/format";
import {
  ADDITIONAL_MONTHLY_OPTIONS,
  calculateLoan,
  DEFAULT_ANNUAL_RATE,
  DEFAULT_DOWN_PERCENT,
  DOWN_PAYMENT_OPTIONS,
  khanBankContactHref,
  KHAN_BANK_LOAN_TERM_MONTHS,
  MIN_DOWN_PERCENT,
} from "@/lib/loan";
import type { Car } from "@/data/cars";

function readNumber(value: string | null, fallback: number) {
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function StatIcon({ children }: { children: ReactNode }) {
  return (
    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/25 bg-white/10 text-white">
      {children}
    </span>
  );
}

function StatCard({
  icon,
  label,
  value,
  subLabel,
  subValue,
  highlight = false,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  subLabel?: string;
  subValue?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex min-h-[120px] flex-col justify-between rounded-2xl border p-5 ${
        highlight
          ? "border-white/30 bg-white/20 shadow-[0_12px_40px_rgba(15,23,42,0.18)]"
          : "border-white/15 bg-white/10"
      }`}
    >
      <div className="flex items-start gap-3">
        <StatIcon>{icon}</StatIcon>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/65">
            {label}
          </p>
          <p className="mt-2 break-words font-mono text-[22px] font-bold leading-tight text-white md:text-[24px]">
            {value}
          </p>
          {subLabel && subValue && (
            <div className="mt-3 border-t border-white/10 pt-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/50">
                {subLabel}
              </p>
              <p className="mt-1 font-mono text-[15px] font-bold text-white/90">{subValue}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const selectClass =
  "w-full cursor-pointer appearance-none rounded-xl border border-white/20 bg-white px-4 py-3 text-[14px] font-medium text-[#0f172a] outline-none transition-all focus:border-white focus:ring-2 focus:ring-white/30";

export function LoanCalculatorPage() {
  const searchParams = useSearchParams();
  const [cars, setCars] = useState<Car[]>([]);
  const [selectedCarSlug, setSelectedCarSlug] = useState("");
  const [price, setPrice] = useState(0);
  const [downPercent, setDownPercent] = useState(
    readNumber(searchParams.get("down"), DEFAULT_DOWN_PERCENT)
  );
  const [additionalMonthly, setAdditionalMonthly] = useState(
    readNumber(searchParams.get("extra"), 0)
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
        termMonths: KHAN_BANK_LOAN_TERM_MONTHS,
        annualRate: DEFAULT_ANNUAL_RATE,
        additionalMonthly,
      }),
    [price, downPercent, additionalMonthly]
  );

  const contactHref = khanBankContactHref({
    car: selectedCarSlug,
    price,
    downPercent,
    termMonths: KHAN_BANK_LOAN_TERM_MONTHS,
    monthly: calculation.monthlyPayment,
    rate: DEFAULT_ANNUAL_RATE,
    extra: additionalMonthly,
  });

  const displayValue = (amount: number) =>
    calculation.isActive ? `${formatAmount(amount)}₮` : "—";

  return (
    <div className="w-full space-y-8">
      <div>
        <h1 className="text-[32px] font-bold tracking-tight text-[#0f172a] md:text-[40px]">
          Зээлийн тооцоолуур
        </h1>
        <p className="mt-2 max-w-2xl text-[14px] leading-7 text-[#64748b]">
          Хаан банкны автомашины зээлийн урьдчилсан тооцоолол. Машин, урьдчилгаа
          болон нэмэлт төлбөрийг сонгоод сарын төлбөрөө шууд хараарай.
        </p>
      </div>

      <div className="overflow-hidden rounded-[28px] bg-[#003da5] p-6 text-white shadow-[0_20px_60px_rgba(0,61,165,0.25)] md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-[22px] font-bold tracking-tight">Машин ба урьдчилгаа</h2>
          <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider">
            Khan Bank
          </span>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <div>
            <label className="mb-2 block text-[12px] font-semibold text-white/80">
              Машины загвар, үнэ
            </label>
            <select
              value={selectedCarSlug}
              onChange={(e) => handleCarChange(e.target.value)}
              className={selectClass}
            >
              {cars.map((car) => (
                <option key={car.slug} value={car.slug}>
                  {car.name} - {formatAmount(car.price)}₮
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-[12px] font-semibold text-white/80">
              Урьдчилгаа хувь
            </label>
            <select
              value={downPercent}
              onChange={(e) => setDownPercent(Number(e.target.value))}
              className={selectClass}
            >
              {DOWN_PAYMENT_OPTIONS.map((value) => (
                <option key={value} value={value}>
                  {value}%
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-[12px] font-semibold text-white/80">
              Банкны тооцсон сарын төлөлт дээр нэмэх дүн
            </label>
            <select
              value={additionalMonthly}
              onChange={(e) => setAdditionalMonthly(Number(e.target.value))}
              className={selectClass}
            >
              {ADDITIONAL_MONTHLY_OPTIONS.map((value) => (
                <option key={value} value={value}>
                  {formatAmount(value)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-amber-300/30 bg-amber-400/10 px-4 py-3 text-[13px] text-amber-50">
          <span className="font-semibold">⚠</span> Урьдчилгаа {MIN_DOWN_PERCENT}%-иос дээш үед
          тооцоолол идэвхтэй.
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <path d="M2 10h20" />
              </svg>
            }
            label="Зээлийн дүн"
            value={displayValue(calculation.loanPrincipal)}
          />
          <StatCard
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M4 16l4-8 4 5 4-9 4 12" />
              </svg>
            }
            label="Урьдчилгаа"
            value={calculation.isActive ? `${downPercent}%` : "—"}
            subLabel="Урьдчилгаа дүн"
            subValue={displayValue(calculation.downPaymentAmount)}
          />
          <StatCard
            highlight
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <path d="M2 10h20" />
              </svg>
            }
            label="Сард төлөх дүн"
            value={displayValue(calculation.monthlyPayment)}
          />
          <StatCard
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7H14a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            }
            label="Хамгийн бага нийт төлөх"
            value={displayValue(calculation.totalPayment)}
          />
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <StatCard
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
            }
            label="Зээлийн хугацаа"
            value={`${KHAN_BANK_LOAN_TERM_MONTHS} сар`}
          />
          <StatCard
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
              </svg>
            }
            label="Зээл дуусах хугацаа"
            value={`${KHAN_BANK_LOAN_TERM_MONTHS} сар`}
          />
          <StatCard
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7H14a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            }
            label="Хүүгийн хэмнэлт"
            value="—"
          />
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-white/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-[12px] leading-6 text-white/70">
            *Тооцоолол нь жишиг бөгөөд Хаан банкны бодит нөхцөл, хүү, шимтгэлээс
            хамааран өөрчлөгдөх боломжтой.
          </p>
          <Link
            href={contactHref}
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-6 text-[13px] font-bold text-[#003da5] transition-colors hover:bg-white/90"
          >
            Хаан банкны зээл судлуулах
            <span>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
