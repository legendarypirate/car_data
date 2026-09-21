export const LOAN_TERM_OPTIONS = [12, 24, 36, 48, 60, 84] as const;
export const DEFAULT_ANNUAL_RATE = 14.4;
export const DEFAULT_DOWN_PERCENT = 30;
export const DEFAULT_TERM_MONTHS = 36;

export type LoanInputs = {
  price: number;
  downPercent: number;
  termMonths: number;
  annualRate: number;
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
  totalInterest: number;
  totalPayment: number;
  schedule: LoanScheduleRow[];
};

export function calculateLoan({
  price,
  downPercent,
  termMonths,
  annualRate,
}: LoanInputs): LoanCalculation {
  const downPaymentAmount = Math.round(price * (downPercent / 100));
  const loanPrincipal = Math.max(0, price - downPaymentAmount);
  const monthlyRate = annualRate / 100 / 12;
  const n = termMonths;

  let monthlyPayment = 0;
  if (loanPrincipal > 0 && n > 0 && monthlyRate > 0) {
    monthlyPayment = Math.round(
      (loanPrincipal * (monthlyRate * Math.pow(1 + monthlyRate, n))) /
        (Math.pow(1 + monthlyRate, n) - 1)
    );
  } else if (loanPrincipal > 0 && n > 0) {
    monthlyPayment = Math.round(loanPrincipal / n);
  }

  const schedule: LoanScheduleRow[] = [];
  let balance = loanPrincipal;
  let totalInterest = 0;

  for (let month = 1; month <= n && balance > 0; month += 1) {
    const interest = Math.round(balance * monthlyRate);
    const principal = Math.min(balance, Math.max(0, monthlyPayment - interest));
    const payment = principal + interest;
    balance = Math.max(0, balance - principal);
    totalInterest += interest;
    schedule.push({ month, payment, interest, principal, balance });
  }

  return {
    downPaymentAmount,
    loanPrincipal,
    monthlyPayment,
    totalInterest,
    totalPayment: downPaymentAmount + loanPrincipal + totalInterest,
    schedule,
  };
}

function loanParams({
  car,
  downPercent,
  termMonths,
  monthly,
  price,
  rate,
}: {
  car?: string;
  downPercent?: number;
  termMonths?: number;
  monthly?: number;
  price?: number;
  rate?: number;
}) {
  const params = new URLSearchParams();
  if (car) params.set("car", car);
  if (price != null) params.set("price", String(price));
  if (downPercent != null) params.set("down", String(downPercent));
  if (termMonths != null) params.set("term", String(termMonths));
  if (monthly != null) params.set("monthly", String(monthly));
  if (rate != null) params.set("rate", String(rate));
  return params;
}

export function loanCalculatorHref(args: {
  car?: string;
  downPercent?: number;
  termMonths?: number;
  monthly?: number;
  price?: number;
  rate?: number;
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
}) {
  const params = loanParams(args);
  params.set("type", "khanbank");
  return `/contact?${params.toString()}`;
}
