export function khanBankLoanHref({
  car,
  downPercent,
  termMonths,
  monthly,
  price,
}: {
  car?: string;
  downPercent?: number;
  termMonths?: number;
  monthly?: number;
  price?: number;
}) {
  const params = new URLSearchParams();
  if (car) params.set("car", car);
  params.set("type", "khanbank");
  if (downPercent != null) params.set("down", String(downPercent));
  if (termMonths != null) params.set("term", String(termMonths));
  if (monthly != null) params.set("monthly", String(monthly));
  if (price != null) params.set("price", String(price));
  return `/contact?${params.toString()}`;
}
