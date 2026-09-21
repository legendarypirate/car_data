export const LOAN_TERM_OPTIONS = [12, 24, 36, 48, 60, 84, 96] as const;
export const KHAN_BANK_LOAN_TERM_MONTHS = 96;
export const DOWN_PAYMENT_OPTIONS = [10, 20, 30, 40, 50, 60, 70] as const;
export const ADDITIONAL_MONTHLY_OPTIONS = [0, 500_000, 1_000_000, 1_500_000, 2_000_000, 3_000_000] as const;
export const MIN_DOWN_PERCENT = 10;
export const DEFAULT_ANNUAL_RATE = 14.4;
export const DEFAULT_DOWN_PERCENT = 10;
export const DEFAULT_TERM_MONTHS = KHAN_BANK_LOAN_TERM_MONTHS;

export type LoanInputs = {
  price: number;
  downPercent: number;
  termMonths: number;
  annualRate: number;
  additionalMonthly?: number;
};

export type LoanScheduleRow = {
  month: number;
  payment: number;
  interest: number;
  principal: number;
  balance: number;
};

export type LoanCalculation = {
  downPaymentAmount: number;
  loanPrincipal: number;
  monthlyPayment: number;
  baseMonthlyPayment: number;
  totalInterest: number;
  totalPayment: number;
  schedule: LoanScheduleRow[];
  isActive: boolean;
};

export function calculateLoan({
  price,
  downPercent,
  termMonths,
  annualRate,
  additionalMonthly = 0,
}: LoanInputs): LoanCalculation {
  const isActive = downPercent >= MIN_DOWN_PERCENT && price > 0;
  const downPaymentAmount = Math.round(price * (downPercent / 100));
  const loanPrincipal = Math.max(0, price - downPaymentAmount);
  const monthlyRate = annualRate / 100 / 12;
  const n = termMonths;

  let baseMonthlyPayment = 0;
  if (isActive && loanPrincipal > 0 && n > 0 && monthlyRate > 0) {
    baseMonthlyPayment = Math.round(
      (loanPrincipal * (monthlyRate * Math.pow(1 + monthlyRate, n))) /
        (Math.pow(1 + monthlyRate, n) - 1)
    );
  } else if (isActive && loanPrincipal > 0 && n > 0) {
    baseMonthlyPayment = Math.round(loanPrincipal / n);
  }

  const monthlyPayment = isActive ? baseMonthlyPayment + additionalMonthly : 0;

  const schedule: LoanScheduleRow[] = [];
  let balance = loanPrincipal;
  let totalInterest = 0;

  if (isActive) {
    for (let month = 1; month <= n && balance > 0; month += 1) {
      const interest = Math.round(balance * monthlyRate);
      const principal = Math.min(balance, Math.max(0, baseMonthlyPayment - interest));
      const payment = principal + interest + additionalMonthly;
      balance = Math.max(0, balance - principal);
      totalInterest += interest;
      schedule.push({ month, payment, interest, principal, balance });
    }
  }

  return {
    downPaymentAmount,
    loanPrincipal: isActive ? loanPrincipal : 0,
    monthlyPayment,
    baseMonthlyPayment,
    totalInterest: isActive ? totalInterest : 0,
    totalPayment: isActive
      ? downPaymentAmount + baseMonthlyPayment * n + totalInterest + additionalMonthly * n
      : 0,
    schedule,
    isActive,
  };
}

function loanParams({
  car,
  downPercent,
  termMonths,
  monthly,
  price,
  rate,
  extra,
}: {
  car?: string;
  downPercent?: number;
  termMonths?: number;
  monthly?: number;
  price?: number;
  rate?: number;
  extra?: number;
}) {
  const params = new URLSearchParams();
  if (car) params.set("car", car);
  if (price != null) params.set("price", String(price));
  if (downPercent != null) params.set("down", String(downPercent));
  if (termMonths != null) params.set("term", String(termMonths));
  if (monthly != null) params.set("monthly", String(monthly));
  if (rate != null) params.set("rate", String(rate));
  if (extra != null && extra > 0) params.set("extra", String(extra));
  return params;
}

export function loanCalculatorHref(args: {
  car?: string;
  downPercent?: number;
  termMonths?: number;
  monthly?: number;
  price?: number;
  rate?: number;
  extra?: number;
}) {
  const params = loanParams(args);
  const query = params.toString();
  return query ? `/loan-calculator?${query}` : "/loan-calculator";
}

export function khanBankLoanHref(args: {
  car?: string;
  downPercent?: number;
  termMonths?: number;
  monthly?: number;
  price?: number;
  rate?: number;
  extra?: number;
}) {
  return loanCalculatorHref(args);
}

export function khanBankContactHref(args: {
  car?: string;
  downPercent?: number;
  termMonths?: number;
  monthly?: number;
  price?: number;
  rate?: number;
  extra?: number;
}) {
  const params = loanParams(args);
  params.set("type", "khanbank");
  return `/contact?${params.toString()}`;
}
