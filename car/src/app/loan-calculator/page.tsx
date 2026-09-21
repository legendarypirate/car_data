import type { Metadata } from "next";
import { Suspense } from "react";
import { LoanCalculatorPage } from "@/components/LoanCalculatorPage";

export const metadata: Metadata = {
  title: "Зээлийн тооцоолуур | NDA AUTO",
  description:
    "Хаан банкны автомашины зээлийн сарын төлбөр, урьдчилгаа, эргэн төлөлтийн хуваарийг тооцоолох.",
};

export default function LoanCalculatorRoute() {
  return (
    <main className="bg-[#f8fafc]">
      <section className="border-b border-[#e2e8f0] bg-[#0b1220] px-6 py-14 text-white">
        <div className="mx-auto max-w-[1400px]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/55">
            Хаан банк
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight md:text-5xl">
            Зээлийн тооцоолуур
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-7 text-white/70">
            Машины үнэ, урьдчилгаа, зээлийн хүү, хугацааг оруулж сарын төлбөр болон
            эргэн төлөлтийг урьдчилан тооцоолно.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1400px] px-6 py-10">
        <Suspense fallback={<div className="py-20 text-center text-sm text-[#64748b]">Уншиж байна...</div>}>
          <LoanCalculatorPage />
        </Suspense>
      </section>
    </main>
  );
}
