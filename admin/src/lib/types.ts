import type { CarTabs } from "@/lib/car-tabs";

export type CarStatus = "in-stock" | "in-transit" | "order";
export type InquiryStatus = "new" | "contacted" | "closed";

export type Car = {
  id: number;
  slug: string;
  name: string;
  brand: string;
  year: number;
  price: number;
  type: string;
  fuelType: string;
  drivetrain: string;
  rangeKm: number;
  rangeLabel?: string | null;
  batteryKwh?: number | null;
  powerKw: number;
  acceleration: string;
  chargeMinutes?: number | null;
  seats: number;
  color: string;
  status: CarStatus;
  badge?: string | null;
  badgeColor?: string | null;
  eta?: string | null;
  highlights: string[];
  description: string;
  image: string;
  gallery: string[];
  bodyLabel?: string | null;
  featured: boolean;
  tabs?: CarTabs | Record<string, unknown>;
};

export type Inquiry = {
  id: number;
  name: string;
  email: string;
  phone: string;
  car: string;
  notes?: string | null;
  status: InquiryStatus;
  createdAt: string;
};

export type Brand = {
  id: number;
  name: string;
  slug: string;
  image: string;
  carCount?: number;
};

export type Stats = {
  totalCars: number;
  inStock: number;
  inTransit: number;
  onOrder: number;
  inquiries: number;
  inventoryValue: number;
  brands: { brand: string; count: number }[];
};
