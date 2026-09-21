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
      <section className="mx-auto w-full max-w-[1200px] px-5 py-8 md:py-10">
        <Suspense fallback={<div className="py-20 text-center text-sm text-[#64748b]">Уншиж байна...</div>}>
          <LoanCalculatorPage />
        </Suspense>
      </section>
    </main>
  );
}
