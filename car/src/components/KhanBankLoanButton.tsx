import Link from "next/link";
import { khanBankLoanHref } from "@/lib/loan";

export function KhanBankLoanButton({
  car,
  downPercent,
  termMonths,
  monthly,
  price,
  variant = "blue",
  className = "",
}: {
  car?: string;
  downPercent?: number;
  termMonths?: number;
  monthly?: number;
  price?: number;
  variant?: "blue" | "light" | "dark";
  className?: string;
}) {
  const styles =
    variant === "light"
      ? "bg-white text-[#003da5] hover:bg-white/90"
      : variant === "dark"
        ? "bg-[#0c121d] text-white hover:bg-[#1e293b]"
        : "bg-[#003da5] text-white hover:bg-[#00308a]";

  return (
    <Link
      href={khanBankLoanHref({ car, downPercent, termMonths, monthly, price })}
      className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl px-5 text-[13px] font-semibold shadow-sm transition-colors ${styles} ${className}`}
    >
      Хаан банкны зээл судлуулах
      <span>→</span>
    </Link>
  );
}
