import type { CmsSection } from "@/lib/cms";

export const ABOUT_SECTIONS: CmsSection[] = [
  {
    id: "about-hero",
    type: "pageHero",
    visible: true,
    variant: "cinema",
    image: "/about-hero.jpg",
    title: "Бидний тухай",
    subtitle: "Илүү цэвэр, илүү ухаалаг, илүү сайн ирээдүй",
    description:
      "NDA AUTO нь дэлхийн шилдэг автомашинуудыг Монголын хэрэглэгчдэд хүргэж, цэвэр, ухаалаг, найдвартай ирээдүйг хамтдаа бүтээнэ.",
    slogan: ["CLEAN", "SMART", "TOGETHER"],
  },
  {
    id: "about-stats",
    type: "stats",
    visible: true,
    variant: "dark",
    items: [
      { icon: "car", value: "500+", label: "Борлуулсан автомашин" },
      { icon: "users", value: "1,000+", label: "Ханамжтай хэрэглэгч" },
      { icon: "globe", value: "10+", label: "Албан ёсны брэнд" },
      { icon: "shield", value: "99%", label: "Хэрэглэгчийн сэтгэл ханамж" },
    ],
  },
  {
    id: "about-story",
    type: "storySplit",
    visible: true,
    image: "/about-story.jpg",
    overlay: "A CLEANER\nGREENER\nBRIGHTER\nMONGOLIA",
    eyebrow: "OUR STORY",
    title: "Илүү сайн ирээдүйн төлөө",
    body: "NDA AUTO нь 2024 онд Монголын автомашины зах зээлд орж, дэлхийн шилдэг бренд, технологийг албан ёсоор хүргэж эхэлсэн. Бид чанар, ил тод байдал, борлуулалтын дараах үйлчилгээг эрхэмлэн, хэрэглэгч бүрийн итгэлтэй түнш байна.",
    ctaLabel: "Бидний үнэ цэнэ",
    ctaHref: "#values",
  },
  {
    id: "about-values",
    type: "valueGrid",
    visible: true,
    eyebrow: "БИДНИЙ ҮНЭ ЦЭНЭ",
    items: [
      {
        icon: "leaf",
        title: "Тогтвортой ирээдүй",
        desc: "Цэвэр эрчим хүч, ногоон технологиор илүү сайн ирээдүйг бүтээнэ.",
      },
      {
        icon: "handshake",
        title: "Хариуцлагатай үйлчилгээ",
        desc: "Хэрэглэгчийн сэтгэл ханамж бол бидний хамгийн чухал үнэ цэнэ.",
      },
      {
        icon: "eye",
        title: "Ил тод, найдвартай",
        desc: "Шударга нөхцөл, нээлттэй хамтын ажиллагааг эрхэмлэнэ.",
      },
      {
        icon: "cog",
        title: "Мэргэжлийн баг",
        desc: "Туршлагатай зөвлөгөө, чин сэтгэлийн үйлчилгээг хүргэнэ.",
      },
    ],
  },
  {
    id: "about-timeline",
    type: "timeline",
    visible: true,
    eyebrow: "БИДНИЙ ХӨГЖЛИЙН ЗАМНАЛ",
    items: [
      { year: "2024", text: "NDA AUTO байгуулагдаж, Монголд үйл ажиллагаагаа эхлүүлсэн." },
      { year: "2025", text: "Шинэ загварууд нэмэгдэж, үйлчилгээний хүрээ өргөжсөн." },
      { year: "2026", text: "Үйлчилгээний төв нээж, сүлжээгээ тэлсэн." },
      { year: "2027", text: "Албан ёсны брендүүдийн тоог нэмэгдүүлсэн." },
      { year: "2030", text: "Монголын тэргүүлэгч авто дилер болох зорилт." },
    ],
  },
  {
    id: "about-team",
    type: "team",
    visible: true,
    eyebrow: "OUR TEAM",
    title: "Илүү том мөрөөдлийг хамтдаа бүтээнэ",
    body: "NDA AUTO-гийн баг нь салбартаа туршлагатай, мэргэжлийн хамт олон. Бид таны сонголт, захиалга, үйлчилгээний бүх үе шатанд хамт байх болно.",
    ctaLabel: "Манай багтай танилцах",
    ctaHref: "/contact",
    photos: [
      { src: "/about-team-1.jpg", alt: "Багийн уулзалт" },
      { src: "/about-team-2.jpg", alt: "Шоурумын үйлчилгээ" },
      { src: "/about-team-3.jpg", alt: "Техникийн үзлэг" },
    ],
  },
];

export function hasAboutLayout(sections?: CmsSection[] | null) {
  if (!sections?.length) return false;
  const types = new Set(sections.map((section) => section.type));
  return types.has("storySplit") && types.has("timeline") && types.has("team");
}
