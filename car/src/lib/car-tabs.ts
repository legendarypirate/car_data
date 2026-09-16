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
  specs: CarTabBase & { intro: string };
  gallery: CarTabBase & { items: GalleryItem[] };
};

export function defaultCarTabs(): CarTabs {
  return {
    overview: {
      visible: true,
      label: "Онцлох",
      title: "Онцлох",
      subtitle: "Шинэ үеийн автомашины дэвшилтэт бүх боломж.",
      heading: "Нэг хуудсанд бүх онцлох боломж",
      heroLine: "Цахилгаан SUV – Илүү их боломжийн төлөө",
      heroText:
        "Тухтай, ухаалаг, аюулгүй, орчин үеийн цахилгаан автомашин бөгөөд өдөр тутмын хэрэгцээ болон гэр бүлийн аялалд төгс тохирно.",
    },
    design: {
      visible: true,
      label: "Дизайн",
      title: "Дизайн",
      subtitle: "Футуристик гоо зүй, төгс аэродинамик харьцаа.",
      features: [
        { title: "Closed Front Grille", sub: "Орчин үеийн цахилгаан загварын илэрхийлэл" },
        { title: "LED Lighting", sub: "Илүү тод, илүү аюулгүй" },
        { title: "Aerodynamic Body", sub: "Салааны эсэргүүцлийг багасгасан бүтэц" },
        { title: "Panoramic Roof", sub: "Илүү өргөн, илүү чөлөөтэй мэдрэмж" },
        { title: "Modern Rear Design", sub: "Тод, танигдахуйц арын хэсэг" },
      ],
    },
    interior: {
      visible: true,
      label: "Интерьер",
      title: "Интерьер",
      subtitle: "Дээд зэргийн тав тух, орчин үеийн дижитал кабин.",
      heroImage: "",
      features: [
        { title: "Өргөн, тав тухтай суудал", sub: "Урт аялалд ч тухтай" },
        { title: "Агаарлаг, илүү орон зай", sub: "Панорам дээвэр" },
        { title: "Байгаль ээлтэй материал", sub: "Дээд зэрэглэлийн чөдөр" },
        { title: "Жолоочид зохион байгуулалт", sub: "Бүх функц гар хүрэх зайнд" },
      ],
      details: [
        { image: "", title: "Панорам дээвэр", sub: "Илүү гэрэл, илүү чөлөөтэй мэдрэмж" },
        { image: "", title: "Орчны гэрэлтүүлэг", sub: "Аялал илүү тав тухтай болгоно" },
      ],
    },
    technology: {
      visible: true,
      label: "Технологи",
      title: "Технологи",
      subtitle: "Илүү ухаалаг жолоодлого. Илүү аюулгүй ирээдүй.",
      heading: "Ухаалаг технологи таны өдөр тутамд",
      body: "Хамгийн сүүлийн үеийн цахилгаан технологи, ухаалаг жолоодлогын системээр тоноглогдсон.",
      highlights: [
        { title: "Аюулгүй жолоодлого", sub: "Safety Sense" },
        { title: "Дижитал холболт", sub: "Smart Connect" },
        { title: "Өндөр хүчин чадлын батерей", sub: "EV Technology" },
        { title: "Програм хангамжийн шинэчлэл", sub: "Over-the-Air Updates" },
      ],
    },
    specs: {
      visible: true,
      label: "Үзүүлэлт",
      title: "Үзүүлэлт",
      subtitle: "Нарийвчилсан техникийн үзүүлэлтүүдтэй танилцана уу.",
      intro: "Таны өдөр тутмын амьдралыг илүү ухаалаг, илүү чөлөөтэй болгох бүрэн цахилгаан SUV.",
    },
    gallery: {
      visible: true,
      label: "Галлерей",
      title: "Галлерей",
      subtitle: "Илүү ойроос мэдр. Илүү ихийг төсөөл.",
      items: [],
    },
  };
}

export function mergeCarTabs(tabs?: Partial<CarTabs> | null): CarTabs {
  const defaults = defaultCarTabs();
  if (!tabs) return defaults;
  return {
    overview: { ...defaults.overview, ...tabs.overview },
    design: {
      ...defaults.design,
      ...tabs.design,
      features: tabs.design?.features?.length ? tabs.design.features : defaults.design.features,
    },
    interior: {
      ...defaults.interior,
      ...tabs.interior,
      features: tabs.interior?.features?.length ? tabs.interior.features : defaults.interior.features,
      details: tabs.interior?.details?.length ? tabs.interior.details : defaults.interior.details,
    },
    technology: {
      ...defaults.technology,
      ...tabs.technology,
      highlights: tabs.technology?.highlights?.length
        ? tabs.technology.highlights
        : defaults.technology.highlights,
    },
    specs: { ...defaults.specs, ...tabs.specs },
    gallery: {
      ...defaults.gallery,
      ...tabs.gallery,
      items: tabs.gallery?.items || [],
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
