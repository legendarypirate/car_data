export type NavLink = { label: string; href: string };

export type HeaderCms = {
  brand: string;
  tagline: string;
  links: NavLink[];
  ctaLabel: string;
  ctaHref: string;
  showSearch: boolean;
  langPrimary: string;
  langSecondary: string;
};

export type FooterCms = {
  brand: string;
  tagline: string;
  description: string;
  columns: { links: NavLink[] }[];
  phone: string;
  email: string;
  address: string;
  socials: { name: string; href: string }[];
  slogan: string[];
  copyright: string;
  legal: NavLink[];
};

export type CmsSection = {
  id: string;
  type: string;
  visible: boolean;
  [key: string]: unknown;
};

export type CmsPage = {
  id?: number;
  slug: string;
  title: string;
  sections: CmsSection[];
};

export const SECTION_TYPES = [
  { type: "hero", label: "Нүүр баннер" },
  { type: "features", label: "Онцлох мөр" },
  { type: "featuredCars", label: "Онцлох машинууд" },
  { type: "brandRow", label: "Брэндийн мөр" },
  { type: "splitCta", label: "Хоёр багана" },
  { type: "pageHero", label: "Хуудасны баннер" },
  { type: "stats", label: "Тоон үзүүлэлт" },
  { type: "storySplit", label: "Түүх / хоёр багана" },
  { type: "valueGrid", label: "Үнэ цэнэ" },
  { type: "timeline", label: "Хөгжлийн замнал" },
  { type: "team", label: "Баг" },
  { type: "richText", label: "Текст" },
  { type: "featureGrid", label: "Онцлох картууд" },
  { type: "brandCards", label: "Брэндийн картууд" },
  { type: "widget", label: "Програмын блок" },
] as const;

export function newId() {
  return Math.random().toString(36).slice(2, 10);
}

export function blankSection(type: string): CmsSection {
  const id = newId();
  const base = { id, type, visible: true };
  switch (type) {
    case "hero":
      return {
        ...base,
        image: "/hero-bg.jpg",
        title: "Шинэ гарчиг",
        subtitle: "Дэмжих текст",
        primaryLabel: "Машинууд",
        primaryHref: "/inventory",
        secondaryLabel: "Бидний тухай",
        badgeEyebrow: "Цахилгаан",
        badgeLine: "Шинэ SUV",
        badgeBrand: "БРЭНД",
        badgeName: "Загвар",
      };
    case "features":
      return { ...base, items: [{ icon: "leaf", title: "Гарчиг", desc: "Тайлбар" }] };
    case "featuredCars":
      return { ...base, eyebrow: "Онцлох", title: "Шинэ аялал", ctaLabel: "Бүх машин", ctaHref: "/inventory" };
    case "brandRow":
      return { ...base, eyebrow: "Брэндүүд", names: ["TOYOTA", "BYD"], ctaLabel: "Цааш", ctaHref: "/brands" };
    case "splitCta":
      return {
        ...base,
        leftImage: "/cta-scenic.jpg",
        leftTitle: "Зүүн гарчиг",
        leftText: "Зүүн текст",
        leftLabel: "Бидний тухай",
        leftHref: "/about",
        rightEyebrow: "NDA AUTO",
        rightTitle: "Баруун гарчиг",
        rightText: "Баруун текст",
        rightLabel: "Холбоо барих",
        rightHref: "/contact",
        cards: [{ title: "Карт", desc: "Дэлгэрэнгүй" }],
      };
    case "pageHero":
      return {
        ...base,
        image: "/hero-bg.jpg",
        title: "Хуудасны гарчиг",
        subtitle: "Дэд гарчиг",
        description: "",
        slogan: ["CLEAN", "SMART", "TOGETHER"],
        variant: "cinema",
      };
    case "stats":
      return { ...base, variant: "dark", items: [{ icon: "car", value: "100+", label: "Гарчиг" }] };
    case "storySplit":
      return {
        ...base,
        image: "/about-story.jpg",
        overlay: "A CLEANER\nGREENER\nBRIGHTER\nMONGOLIA",
        eyebrow: "OUR STORY",
        title: "Илүү сайн ирээдүйн төлөө",
        body: "Энд түүхээ бичнэ үү.",
        ctaLabel: "Бидний үнэ цэнэ",
        ctaHref: "#values",
      };
    case "valueGrid":
      return {
        ...base,
        eyebrow: "БИДНИЙ ҮНЭ ЦЭНЭ",
        items: [{ icon: "leaf", title: "Үнэ цэнэ", desc: "Тайлбар" }],
      };
    case "timeline":
      return {
        ...base,
        eyebrow: "БИДНИЙ ХӨГЖЛИЙН ЗАМНАЛ",
        items: [{ year: "2024", text: "Эхлэл" }],
      };
    case "team":
      return {
        ...base,
        eyebrow: "OUR TEAM",
        title: "Илүү том мөрөөдлийг хамтдаа бүтээнэ",
        body: "Багийн тухай текст.",
        ctaLabel: "Манай багтай танилцах",
        ctaHref: "/contact",
        photos: [
          { src: "/about-team-1.jpg", alt: "Баг" },
          { src: "/about-team-2.jpg", alt: "Шоурм" },
          { src: "/about-team-3.jpg", alt: "Үйлчилгээ" },
        ],
      };
    case "richText":
      return { ...base, heading: "Гарчиг", body: "Энд текстээ бичнэ үү." };
    case "featureGrid":
      return { ...base, items: [{ title: "Онцлог", desc: "Тайлбар" }] };
    case "brandCards":
      return {
        ...base,
        items: [{ name: "Брэнд", count: "1 загвар", image: "/car-toyota-bz3x.jpg", href: "/inventory" }],
      };
    case "widget":
      return { ...base, widget: "contact" };
    default:
      return base;
  }
}

export function siteImage(path?: string) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}${path}`;
}
