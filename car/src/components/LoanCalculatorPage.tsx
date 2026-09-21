"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { fetchCars } from "@/lib/cars";
import { formatAmount } from "@/lib/format";
import {
  ADDITIONAL_MONTHLY_OPTIONS,
  calculateLoan,
  DEFAULT_ADDITIONAL_MONTHLY,
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
    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/15 bg-white/5 text-white/80">
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
      className={`rounded-xl border p-4 ${
        highlight
          ? "border-white/20 bg-white/12"
          : "border-white/10 bg-white/[0.04]"
      }`}
    >
      <div className="flex items-start gap-3">
        <StatIcon>{icon}</StatIcon>
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/50">
            {label}
          </p>
          <p className="mt-1.5 font-mono text-[18px] font-bold leading-tight text-white md:text-[20px]">
            {value}
          </p>
          {subLabel && subValue && (
            <div className="mt-2.5 border-t border-white/10 pt-2.5">
              <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-white/40">
                {subLabel}
              </p>
              <p className="mt-0.5 font-mono text-[13px] font-semibold text-white/85">
                {subValue}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const selectClass =
  "w-full cursor-pointer appearance-none rounded-lg border border-[#e2e8f0] bg-white px-3.5 py-2.5 text-[13px] font-medium text-[#0f172a] outline-none transition-all focus:border-[#0c121d] focus:ring-1 focus:ring-[#0c121d]";

const labelClass = "mb-1.5 block text-[11px] font-semibold text-[#64748b]";

export function LoanCalculatorPage() {
  const searchParams = useSearchParams();
  const [cars, setCars] = useState<Car[]>([]);
  const [selectedCarSlug, setSelectedCarSlug] = useState("");
  const [price, setPrice] = useState(0);
  const [downPercent, setDownPercent] = useState(
    readNumber(searchParams.get("down"), DEFAULT_DOWN_PERCENT)
  );
  const [additionalMonthly, setAdditionalMonthly] = useState(
    readNumber(searchParams.get("extra"), DEFAULT_ADDITIONAL_MONTHLY)
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
    <div className="w-full space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold tracking-tight text-[#0f172a] md:text-[32px]">
            Зээлийн тооцоолуур
          </h1>
          <p className="mt-1 text-[13px] text-[#64748b]">
            Хаан банк · {KHAN_BANK_LOAN_TERM_MONTHS} сарын хугацаатай урьдчилсан тооцоолол
          </p>
        </div>
        <Link
          href={contactHref}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#0c121d] px-5 text-[13px] font-semibold text-white transition-colors hover:bg-[#1e293b]"
        >
          Зээл судлуулах
          <span>→</span>
        </Link>
      </div>

      <div className="rounded-2xl border border-[#e2e8f0] bg-white p-4 shadow-sm md:p-5">
        <h2 className="text-[15px] font-bold text-[#0f172a]">Машин ба урьдчилгаа</h2>

        <div className="mt-4 grid gap-3 lg:grid-cols-3">
          <div>
            <label className={labelClass}>Машины загвар, үнэ</label>
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
            <label className={labelClass}>Урьдчилгаа хувь</label>
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
            <label className={labelClass}>Банкны тооцсон сарын төлөлт дээр нэмэх дүн</label>
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

        <p className="mt-3 rounded-lg bg-[#f8fafc] px-3 py-2 text-[12px] text-[#64748b]">
          Урьдчилгаа {MIN_DOWN_PERCENT}%-иос дээш үед тооцоолол идэвхтэй.
        </p>
      </div>

      <div className="rounded-2xl bg-[#0c121d] p-4 text-white md:p-5">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <path d="M2 10h20" />
              </svg>
            }
            label="Зээлийн дүн"
            value={displayValue(calculation.loanPrincipal)}
          />
          <StatCard
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
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
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <path d="M2 10h20" />
              </svg>
            }
            label="Сард төлөх дүн"
            value={displayValue(calculation.monthlyPayment)}
          />
          <StatCard
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7H14a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            }
            label="Хамгийн бага нийт төлөх"
            value={displayValue(calculation.totalPayment)}
          />
        </div>

        <div className="mt-3 grid gap-3 md:grid-cols-3">
          <StatCard
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
            }
            label="Зээлийн хугацаа"
            value={`${KHAN_BANK_LOAN_TERM_MONTHS} сар`}
          />
          <StatCard
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
              </svg>
            }
            label="Зээл дуусах хугацаа"
            value={`${KHAN_BANK_LOAN_TERM_MONTHS} сар`}
          />
          <StatCard
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7H14a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            }
            label="Хүүгийн хэмнэлт"
            value="—"
          />
        </div>
      </div>

      {calculation.isActive && calculation.schedule.length > 0 && (
        <div className="overflow-hidden rounded-2xl bg-[#0b1220] text-white">
          <div className="flex flex-col gap-3 border-b border-white/10 px-4 py-4 md:flex-row md:items-end md:justify-between md:px-5">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">
                Төлөлтийн хуваарь
              </p>
              <h3 className="mt-1 text-[22px] font-bold tracking-tight">Хаан банк</h3>
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-1 text-[12px] text-white/65">
              <span>
                Дуусах хугацаа:{" "}
                <strong className="text-white">{KHAN_BANK_LOAN_TERM_MONTHS} сар</strong>
              </span>
              <span>
                Нийт төлөх:{" "}
                <strong className="font-mono text-white">
                  {formatAmount(calculation.totalPayment)}₮
                </strong>
              </span>
              <span>
                Нийт хүү:{" "}
                <strong className="font-mono text-white">
                  {formatAmount(calculation.totalInterest)}₮
                </strong>
              </span>
            </div>
          </div>

          <div className="max-h-[420px] overflow-auto">
            <table className="min-w-full text-left text-[12px]">
              <thead className="sticky top-0 z-10 bg-[#111827] text-[10px] uppercase tracking-[0.14em] text-white/55">
                <tr>
                  <th className="px-4 py-3 font-semibold md:px-5">Сар</th>
                  <th className="px-4 py-3 font-semibold md:px-5">Төлөх дүн</th>
                  <th className="px-4 py-3 font-semibold md:px-5">Нэмэлт төлөлт</th>
                  <th className="px-4 py-3 font-semibold md:px-5">Үндсэн зээл</th>
                  <th className="px-4 py-3 font-semibold md:px-5">Хүү</th>
                  <th className="px-4 py-3 font-semibold md:px-5">Үлдэгдэл</th>
                </tr>
              </thead>
              <tbody>
                {calculation.schedule.map((row, index) => (
                  <tr
                    key={row.month}
                    className={index % 2 === 0 ? "bg-white/[0.03]" : "bg-white/[0.06]"}
                  >
                    <td className="px-4 py-2.5 font-medium text-white/90 md:px-5">{row.month}</td>
                    <td className="px-4 py-2.5 font-mono md:px-5">{formatAmount(row.payment)}₮</td>
                    <td className="px-4 py-2.5 font-mono text-white/60 md:px-5">
                      {row.additionalPayment > 0 ? `${formatAmount(row.additionalPayment)}₮` : "—"}
                    </td>
                    <td className="px-4 py-2.5 font-mono md:px-5">{formatAmount(row.principal)}₮</td>
                    <td className="px-4 py-2.5 font-mono text-white/75 md:px-5">
                      {formatAmount(row.interest)}₮
                    </td>
                    <td className="px-4 py-2.5 font-mono md:px-5">{formatAmount(row.balance)}₮</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <p className="text-[11px] leading-relaxed text-[#94a3b8]">
        *Тооцоолол нь жишиг бөгөөд Хаан банкны бодит нөхцөл, хүү, шимтгэлээс хамааран
        өөрчлөгдөх боломжтой.
      </p>
    </div>
  );
}
