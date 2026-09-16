export const TAB_IDS = [
  "overview",
  "design",
  "interior",
  "technology",
  "specs",
  "gallery",
] as const;

export type TabId = (typeof TAB_IDS)[number];

export type TextPair = { title: string; sub: string };
export type GalleryItem = { image: string; tag: string; category: string; caption: string };
export type DetailItem = { image: string; title: string; sub: string };
export type SpecMetric = { value: string; label: string };
export type SpecRow = { label: string; value: string };
export type SpecGroup = { title: string; rows: SpecRow[] };

export type CarTabBase = {
  visible: boolean;
  label: string;
  title: string;
  subtitle: string;
};

export type CarTabs = {
  overview: CarTabBase & { heading: string; heroLine: string; heroText: string };
  design: CarTabBase & { features: TextPair[] };
  interior: CarTabBase & { heroImage: string; features: TextPair[]; details: DetailItem[] };
  technology: CarTabBase & { heading: string; body: string; highlights: TextPair[] };
  specs: CarTabBase & { intro: string; metrics: SpecMetric[]; groups: SpecGroup[] };
  gallery: CarTabBase & { items: GalleryItem[] };
};

type SpecSource = {
  year: number;
  type: string;
  fuelType: string;
  drivetrain: string;
  seats: number;
  color: string;
  powerKw: number;
  acceleration: string;
  rangeKm: number;
  rangeLabel?: string | null;
  batteryKwh?: number | string | null;
  chargeMinutes?: number | string | null;
};

export function fuelLabel(fuelType: string) {
  if (fuelType === "EV") return "Бүрэн цахилгаан (BEV)";
  if (fuelType === "HEV") return "Хайбрид (HEV)";
  if (fuelType === "Diesel") return "Дизель";
  if (fuelType === "Petrol") return "Бензин";
  return fuelType;
}

export function specsFromCar(car: SpecSource): { metrics: SpecMetric[]; groups: SpecGroup[] } {
  const range = car.rangeLabel || (car.rangeKm ? `${car.rangeKm} км` : "");
  const battery = car.batteryKwh ? `${car.batteryKwh} кВт·ц` : "";
  const charge = car.chargeMinutes ? `${car.chargeMinutes} мин` : "";
  return {
    metrics: [
      { value: range, label: "Явалтын цэнэг" },
      { value: car.acceleration || "", label: "0–100 км/ц" },
      { value: battery, label: "Батарейн багтаамж" },
      { value: charge, label: "10% – 80% цэнэглэлт" },
    ].filter((item) => item.value),
    groups: [
      {
        title: "Ерөнхий үзүүлэлт",
        rows: [
          { label: "Он", value: String(car.year || "") },
          { label: "Төрөл", value: car.type || "" },
          { label: "Түлш", value: fuelLabel(car.fuelType || "") },
          { label: "Хөтлөгч", value: car.drivetrain || "" },
          { label: "Суудлын тоо", value: car.seats ? String(car.seats) : "" },
          { label: "Өнгө", value: car.color || "" },
        ].filter((row) => row.value),
      },
      {
        title: "Гүйцэтгэл",
        rows: [
          { label: "Хүчин чадал", value: car.powerKw ? `${car.powerKw} кВт` : "" },
          { label: "0–100 км/ц", value: car.acceleration || "" },
          { label: "Туулах зай", value: range },
          { label: "Батарей", value: battery },
          { label: "Цэнэглэлт", value: charge },
        ].filter((row) => row.value),
      },
    ].filter((group) => group.rows.length),
  };
}

export function defaultCarTabs(): CarTabs {
  return {
    overview: {
      visible: true,
      label: "Онцлох",
      title: "Онцлох",
      subtitle: "",
      heading: "",
      heroLine: "",
      heroText: "",
    },
    design: {
      visible: true,
      label: "Дизайн",
      title: "Дизайн",
      subtitle: "",
      features: [],
    },
    interior: {
      visible: true,
      label: "Интерьер",
      title: "Интерьер",
      subtitle: "",
      heroImage: "",
      features: [],
      details: [],
    },
    technology: {
      visible: true,
      label: "Технологи",
      title: "Технологи",
      subtitle: "",
      heading: "",
      body: "",
      highlights: [],
    },
    specs: {
      visible: true,
      label: "Үзүүлэлт",
      title: "Үзүүлэлт",
      subtitle: "",
      intro: "",
      metrics: [],
      groups: [],
    },
    gallery: {
      visible: true,
      label: "Галлерей",
      title: "Галлерей",
      subtitle: "",
      items: [],
    },
  };
}

function listed<T>(value: T[] | undefined, fallback: T[]) {
  return Array.isArray(value) ? value : fallback;
}

export function mergeCarTabs(tabs?: Partial<CarTabs> | null): CarTabs {
  const defaults = defaultCarTabs();
  if (!tabs) return defaults;
  return {
    overview: { ...defaults.overview, ...tabs.overview },
    design: {
      ...defaults.design,
      ...tabs.design,
      features: listed(tabs.design?.features, defaults.design.features),
    },
    interior: {
      ...defaults.interior,
      ...tabs.interior,
      features: listed(tabs.interior?.features, defaults.interior.features),
      details: listed(tabs.interior?.details, defaults.interior.details),
    },
    technology: {
      ...defaults.technology,
      ...tabs.technology,
      highlights: listed(tabs.technology?.highlights, defaults.technology.highlights),
    },
    specs: {
      ...defaults.specs,
      ...tabs.specs,
      metrics: listed(tabs.specs?.metrics, defaults.specs.metrics),
      groups: listed(tabs.specs?.groups, defaults.specs.groups),
    },
    gallery: {
      ...defaults.gallery,
      ...tabs.gallery,
      items: listed(tabs.gallery?.items, defaults.gallery.items),
    },
  };
}

export const TAB_META: { id: TabId; name: string }[] = [
  { id: "overview", name: "Онцлох" },
  { id: "design", name: "Дизайн" },
  { id: "interior", name: "Интерьер" },
  { id: "technology", name: "Технологи" },
  { id: "specs", name: "Үзүүлэлт" },
  { id: "gallery", name: "Галлерей" },
];
