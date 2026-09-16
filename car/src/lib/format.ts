import type { Car, CarStatus } from "@/data/cars";

export function formatAmount(amount: number) {
  if (!Number.isFinite(amount) || amount <= 0) return "";
  return Math.round(amount).toLocaleString("en-US");
}

export function parseAmount(value: string) {
  const digits = value.replace(/[^\d]/g, "");
  if (!digits) return 0;
  return Number(digits);
}

export function formatPrice(amount: number) {
  return `₮ ${formatAmount(amount) || "0"}`;
}

export function formatRange(km: number) {
  return `${km.toLocaleString("en-US")} км`;
}

export const statusCopy: Record<
  CarStatus,
  { label: string; detail: (car: Car) => string }
> = {
  "in-stock": {
    label: "Бэлэн байгаа",
    detail: () => "Шалгагдсан, энэ долоо хоногт хүлээн авах боломжтой",
  },
  "in-transit": {
    label: "Тээвэрлэж байгаа",
    detail: (car) => (car.eta ? `${car.eta}-д ирнэ` : "Тээвэрлэж байна"),
  },
  order: {
    label: "Захиалга",
    detail: (car) =>
      car.eta ? `Үйлдвэрлэлийн хугацаа ${car.eta}` : "Захиалгаар үйлдвэрлэнэ",
  },
};

export function getCarSpecs(car: Car) {
  const mileage =
    car.status === "in-stock" ? 48 : car.status === "in-transit" ? 12 : 0;

  return [
    ["Он", String(car.year)],
    ["Импорт", "Хятад"],
    ["Биеийн төрөл", car.type],
    ["Гадна өнгө", car.color],
    ["Дотор засал", "Хар"],
    ["Гүйлт", `${mileage.toLocaleString("en-US")} км`],
    ["Зай", formatRange(car.rangeKm)],
    ["Батерей", `${car.batteryKwh} кВтц`],
    ["Хүчин чадал", `${car.powerKw} кВт`],
    ["0–100 км/ц", car.acceleration],
    ["Цэнэглэлт 10–80%", `${car.chargeMinutes} мин`],
    ["Хөтлөгч", car.drivetrain],
    ["Түлш", car.brand === "Li Auto" ? "EREV" : "Цахилгаан"],
    ["Суудал", String(car.seats)],
    ["Худалдагч", "NDA AUTO"],
    ["Төлөв", statusCopy[car.status].label],
  ];
}
