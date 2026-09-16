"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/format";

export function CarDetailFinancing({
  carPrice,
  carName,
  carSlug,
}: {
  carPrice: number;
  carName: string;
  carSlug: string;
}) {
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(30);
  const [termMonths, setTermMonths] = useState<number>(36);

  const { downPaymentAmount, loanPrincipal, monthlyPayment } = useMemo(() => {
    const down = Math.round(carPrice * (downPaymentPercent / 100));
    const principal = Math.max(0, carPrice - down);
    const monthlyRate = 0.012; // 1.2% per month
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
  }, [carPrice, downPaymentPercent, termMonths]);

  return (
    <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 lg:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-ink">
            {carName} — Санхүүжилтийн тооцоолуур
          </h3>
          <p className="mt-1 text-[13px] text-[#64748b]">
            Урьдчилгаа болон хугацааг тохируулан сарын төлбөрөө урьдчилан
            тооцоолоорой.
          </p>
        </div>
        <div className="text-right">
          <span className="text-[12px] text-[#64748b] block">Нийт үнэ</span>
          <span className="text-xl font-extrabold text-ink font-mono">
            {formatPrice(carPrice)}
          </span>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12 items-center">
        {/* Sliders & Controls */}
        <div className="space-y-6 lg:col-span-7">
          {/* Down Payment Slider */}
          <div>
            <div className="flex items-center justify-between mb-2 text-[13px]">
              <span className="font-semibold text-ink">Урьдчилгаа төлбөр</span>
              <span className="font-bold text-ink font-mono">
                {downPaymentPercent}% ({formatPrice(downPaymentAmount)})
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="70"
              step="5"
              value={downPaymentPercent}
              onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
              className="w-full accent-[#0c121d] h-2 bg-[#e2e8f0] rounded-lg appearance-none cursor-pointer"
            />
            <div className="mt-1 flex items-center justify-between text-[11px] text-[#94a3b8]">
              <span>10% (хамгийн бага)</span>
              <span>70%</span>
            </div>
          </div>

          {/* Term Selector */}
          <div>
            <label className="block text-[13px] font-semibold text-ink mb-2">
              Зээлийн хугацаа
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {[12, 24, 36, 48, 60, 84].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setTermMonths(m)}
                  className={`rounded-lg py-2 text-[12px] font-bold transition-all ${
                    termMonths === m
                      ? "bg-[#0c121d] text-white shadow-sm"
                      : "border border-[#e2e8f0] bg-white text-[#475569] hover:border-[#0c121d] hover:text-ink"
                  }`}
                >
                  {m} сар
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Output Box */}
        <div className="rounded-2xl bg-[#0c121d] p-6 text-white shadow-md lg:col-span-5 flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-semibold text-white/70 uppercase tracking-wider">
              Сарын төлбөр (ойролцоогоор)
            </span>
            <div className="mt-2 text-3xl font-extrabold text-white font-mono">
              ₮ {monthlyPayment.toLocaleString("en-US")}
            </div>
            <div className="mt-3 flex items-center justify-between text-[12px] text-white/70 border-t border-white/10 pt-3">
              <span>Зээлийн дүн:</span>
              <span className="font-bold text-white font-mono">
                {formatPrice(loanPrincipal)}
              </span>
            </div>
          </div>

          <Link
            href={`/contact?car=${carSlug}&type=financing`}
            className="mt-6 flex h-10 items-center justify-center gap-2 rounded-xl bg-white text-[13px] font-bold text-[#0c121d] shadow-sm transition-all hover:bg-white/90 active:scale-95"
          >
            <span>Энэ нөхцөлөөр хүсэлт илгээх</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
