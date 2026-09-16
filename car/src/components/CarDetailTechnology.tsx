import Image from "next/image";
import Link from "next/link";
import type { Car } from "@/data/cars";
import { mergeCarTabs } from "@/lib/car-tabs";

function ChipIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <rect x="7" y="7" width="10" height="10" rx="1.5" />
      <path d="M7 10H4M7 14H4M20 10h-3M20 14h-3M10 7V4M14 7V4M10 20v-3M14 20v-3" />
    </svg>
  );
}

function ScreenIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <rect x="3" y="4" width="18" height="13" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  );
}

function BatteryIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <rect x="3" y="7" width="16" height="10" rx="2" />
      <path d="M19 10h2v4h-2M8 10v4M12 10v4" />
    </svg>
  );
}

function CarUpdateIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M5 17h-1a2 2 0 0 1-2-2v-3l2-5h7l2 5h4a2 2 0 0 1 2 2v3h-1" />
      <circle cx="7.5" cy="17.5" r="1.5" />
      <circle cx="16.5" cy="17.5" r="1.5" />
      <path d="M9 17h6" />
    </svg>
  );
}

function RadarCar() {
  return (
    <div className="relative mx-auto h-[260px] w-[260px] md:h-[300px] md:w-[300px]">
      <div className="absolute inset-0 rounded-full border border-sky-400/15" />
      <div className="absolute inset-[18px] rounded-full border border-sky-400/25" />
      <div className="absolute inset-[42px] rounded-full border border-sky-400/45" />
      <div className="absolute inset-[68px] rounded-full border border-sky-400/70" />
      <div className="radar-sweep absolute inset-0 rounded-full" />
      <svg
        viewBox="0 0 220 120"
        className="absolute left-1/2 top-1/2 z-10 h-[88px] w-[160px] -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_12px_24px_rgba(0,0,0,0.55)]"
      >
        <ellipse cx="110" cy="112" rx="58" ry="6" fill="rgba(0,0,0,0.35)" />
        <path
          d="M48 78c6-22 22-38 62-38s56 16 62 38c3 10 4 18-2 22-8 6-22 8-60 8s-52-2-60-8c-6-4-5-12-2-22z"
          fill="#f4f7fb"
        />
        <path
          d="M70 48c10-8 22-12 40-12s30 4 40 12c-8 6-22 9-40 9s-32-3-40-9z"
          fill="#1e293b"
        />
        <path d="M78 46c6-4 14-6 32-6s26 2 32 6l-8 8H86l-8-8z" fill="#7dd3fc" opacity="0.55" />
        <rect x="86" y="70" width="48" height="18" rx="4" fill="#e2e8f0" />
        <rect x="38" y="62" width="18" height="28" rx="6" fill="#cbd5e1" />
        <rect x="164" y="62" width="18" height="28" rx="6" fill="#cbd5e1" />
        <circle cx="47" cy="90" r="9" fill="#0f172a" />
        <circle cx="173" cy="90" r="9" fill="#0f172a" />
        <circle cx="47" cy="90" r="4" fill="#64748b" />
        <circle cx="173" cy="90" r="4" fill="#64748b" />
      </svg>
    </div>
  );
}

function BatteryCutaway() {
  return (
    <svg viewBox="0 0 640 320" className="h-full w-full">
      <defs>
        <linearGradient id="glass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#334155" stopOpacity="0.15" />
        </linearGradient>
      </defs>
      <ellipse cx="320" cy="292" rx="210" ry="14" fill="rgba(0,0,0,0.35)" />
      <path
        d="M90 210c18-70 70-118 230-118s212 48 230 118c8 28 6 48-14 58-40 20-128 28-216 28s-176-8-216-28c-20-10-22-30-14-58z"
        fill="none"
        stroke="#7dd3fc"
        strokeWidth="2"
        opacity="0.55"
      />
      <path
        d="M150 128c28-22 78-36 170-36s142 14 170 36"
        fill="none"
        stroke="#e2e8f0"
        strokeWidth="2"
        opacity="0.4"
      />
      <g transform="translate(168 168)">
        {Array.from({ length: 8 }).map((_, row) =>
          Array.from({ length: 12 }).map((_, col) => (
            <rect
              key={`${row}-${col}`}
              x={col * 24}
              y={row * 12}
              width="20"
              height="9"
              rx="1.5"
              fill={row > 1 && row < 6 ? "#38bdf8" : "#0ea5e9"}
              opacity={0.55 + (row % 3) * 0.12}
            />
          )),
        )}
      </g>
      <path
        d="M120 200c20-8 70-14 200-14s180 6 200 14"
        fill="none"
        stroke="#38bdf8"
        strokeWidth="1.5"
        opacity="0.7"
      />
    </svg>
  );
}

const safetyItems = [
  {
    title: "Урд мөргөлдөөнөөс сэргийлэх",
    en: "Pre-Collision System (PCS)",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M4 17h16M7 17 9 8h6l2 9" />
        <circle cx="8" cy="18.5" r="1.4" />
        <circle cx="16" cy="18.5" r="1.4" />
      </svg>
    ),
  },
  {
    title: "Замын зурвасын тусламж",
    en: "Lane Tracing Assist (LTA)",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M5 4v16M19 4v16" strokeDasharray="2 3" />
        <rect x="9" y="7" width="6" height="10" rx="1.5" />
      </svg>
    ),
  },
  {
    title: "Адаптив хурдны хяналт",
    en: "Dynamic Radar Cruise Control (DRCC)",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
      </svg>
    ),
  },
  {
    title: "Сохор бүсийн хяналт",
    en: "Blind Spot Monitor (BSM)",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <circle cx="12" cy="12" r="3" />
        <path d="M5 7a9 9 0 0 0 0 10M19 7a9 9 0 0 1 0 10" />
      </svg>
    ),
  },
  {
    title: "Араас хөндлөн хөдөлгөөн илрүүлэх",
    en: "Rear Cross Traffic Alert (RCTA)",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M4 16h16M8 16l2-8h4l2 8" />
        <path d="M6 10h-2M20 10h-2" />
      </svg>
    ),
  },
];

export function CarDetailTechnology({ car }: { car: Car }) {
  const tabs = mergeCarTabs(car.tabs);
  const safetyLabel =
    car.brand === "Toyota" ? "TOYOTA SAFETY SENSE" : `${car.brand.toUpperCase()} SAFETY`;
  const connectLabel =
    car.brand === "Toyota" ? "TOYOTA SMART CONNECT" : `${car.brand.toUpperCase()} CONNECT`;
  const appName = car.brand === "Toyota" ? "MyToyota" : `My${car.brand.replace(/\s/g, "")}`;
  const range = car.rangeKm;
  const battery = car.batteryKwh ?? 90;
  const charge = car.chargeMinutes ?? 30;

  const fallbackHighlights = [
    {
      href: "#safety",
      icon: <ChipIcon />,
      title: "Ухаалаг жолоодлогын туслах систем",
      sub: car.brand === "Toyota" ? "Toyota Safety Sense" : `${car.brand} Safety`,
    },
    {
      href: "#connect",
      icon: <ScreenIcon />,
      title: "Дижитал холболт",
      sub: car.brand === "Toyota" ? "Toyota Smart Connect" : `${car.brand} Connect`,
    },
    {
      href: "#ev",
      icon: <BatteryIcon />,
      title: "Өндөр хүчин чадлын батерей",
      sub: "EV Technology",
    },
    {
      href: "#ota",
      icon: <CarUpdateIcon />,
      title: "Програм хангамжийн шинэчлэл",
      sub: "Over-the-Air Updates",
    },
  ];
  const highlights = tabs.technology.highlights.map((item, index) => ({
    ...fallbackHighlights[index % fallbackHighlights.length],
    ...item,
  }));

  const connectItems = [
    `14.6" мэдрэгч дэлгэц`,
    "Ухаалаг утасны холболт (Apple CarPlay / Android Auto)",
    "Навигацийн систем",
    "Дуут удирдлага (Voice Assistant)",
    `Ухаалаг апп (${appName})`,
  ];

  return (
    <div className="space-y-8">
      <div className="grid items-start gap-10 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#94a3b8]">
            TECHNOLOGY
          </p>
          <h2 className="mt-2 max-w-md text-[32px] font-bold leading-[1.15] tracking-tight text-[#0f172a] md:text-[40px]">
            {tabs.technology.heading}
          </h2>
          <p className="mt-4 max-w-xl text-[15px] leading-7 text-[#64748b]">
            {tabs.technology.body}
          </p>
        </div>

        <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:col-span-6">
          {highlights.map((item) => (
            <a
              key={item.title}
              href={item.href}
              className="flex items-start gap-3.5 rounded-2xl border border-[#eef2f6] bg-white px-4 py-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)] transition-colors hover:border-[#dbe3ee]"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#f8fafc] text-[#0f172a]">
                {item.icon}
              </span>
              <span>
                <span className="block text-[14px] font-semibold leading-snug text-[#0f172a]">
                  {item.title}
                </span>
                <span className="mt-1 block text-[12px] text-[#94a3b8]">{item.sub}</span>
              </span>
            </a>
          ))}
        </div>
      </div>

      <section
        id="safety"
        className="scroll-mt-32 overflow-hidden rounded-[28px] bg-[#0b1220] px-6 py-8 text-white md:px-10 md:py-10"
      >
        <div className="grid items-center gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/45">
              {safetyLabel}
            </p>
            <h3 className="mt-3 text-[28px] font-bold leading-tight tracking-tight md:text-[32px]">
              Илүү аюулгүй жолоодлого
            </h3>
            <p className="mt-4 max-w-sm text-[14px] leading-7 text-white/60">
              Олон төрлийн мэдрэгч, камер, радарын системээр таныг болон таны ойр орчныг
              тасралтгүй хянаж, эрсдэлээс хамгаална.
            </p>
            <a
              href="#offer"
              className="mt-8 inline-flex items-center gap-2 text-[14px] font-medium text-white/90 hover:text-white"
            >
              Дэлгэрэнгүй <span>→</span>
            </a>
          </div>

          <div className="lg:col-span-4">
            <RadarCar />
          </div>

          <div className="space-y-5 lg:col-span-4">
            {safetyItems.map((item) => (
              <div key={item.en} className="flex items-start gap-3.5">
                <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center text-white/85">
                  {item.icon}
                </span>
                <div>
                  <p className="text-[14px] font-semibold leading-snug">{item.title}</p>
                  <p className="mt-0.5 text-[12px] text-white/40">{item.en}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="connect"
        className="scroll-mt-32 grid items-center gap-8 overflow-hidden rounded-[28px] border border-[#eef2f6] bg-white p-0 shadow-[0_8px_24px_rgba(15,23,42,0.04)] lg:grid-cols-12"
      >
        <div className="px-7 py-8 md:px-10 lg:col-span-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#94a3b8]">
            {connectLabel}
          </p>
          <h3 className="mt-3 text-[28px] font-bold leading-tight tracking-tight text-[#0f172a] md:text-[32px]">
            Таны ертөнц үргэлж холбогдсон
          </h3>
          <p className="mt-4 text-[14px] leading-7 text-[#64748b]">
            Том хэмжээний мэдрэгч дэлгэц, ухаалаг холболтын системээр аялал бүрийг илүү
            тохиромжтой, хөгжилтэй болгоно.
          </p>
          <ul className="mt-6 space-y-3 text-[14px] text-[#0f172a]">
            {connectItems.map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <span className="mt-0.5 text-[#16a34a]">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative min-h-[280px] overflow-hidden lg:col-span-7 lg:min-h-[420px]">
          <Image
            src="https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1600&q=80"
            alt={`${car.name} digital cockpit`}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </section>

      <div className="grid items-stretch gap-6 lg:grid-cols-12">
        <section
          id="ev"
          className="scroll-mt-32 grid gap-6 rounded-[28px] border border-[#eef2f6] bg-white p-7 shadow-[0_8px_24px_rgba(15,23,42,0.04)] md:p-8 lg:col-span-8 lg:grid-cols-2"
        >
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#94a3b8]">
              EV TECHNOLOGY
            </p>
            <h3 className="mt-3 text-[26px] font-bold leading-tight tracking-tight text-[#0f172a]">
              Илүү хол, илүү чөлөөтэй
            </h3>
            <p className="mt-3 text-[14px] leading-7 text-[#64748b]">
              {car.brand}-ийн шинэ үеийн цахилгаан хөдөлгүүр болон өндөр хүчин чадлын
              батерей нь илүү үр ашигтай, тогтвортой жолоодлогыг хангана.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-3">
              <div>
                <p className="text-[26px] font-bold tracking-tight text-[#0f172a] md:text-[30px]">
                  {range} км
                </p>
                <p className="mt-1 text-[11px] leading-4 text-[#94a3b8]">
                  Нэг цэнэгээр явах боломж*
                </p>
              </div>
              <div>
                <p className="text-[26px] font-bold tracking-tight text-[#0f172a] md:text-[30px]">
                  {battery} кВт·ц
                </p>
                <p className="mt-1 text-[11px] leading-4 text-[#94a3b8]">Батерейн багтаамж</p>
              </div>
              <div>
                <p className="text-[26px] font-bold tracking-tight text-[#0f172a] md:text-[30px]">
                  {charge} мин
                </p>
                <p className="mt-1 text-[11px] leading-4 text-[#94a3b8]">
                  Хурдан цэнэглэлт (10% → 80%)
                </p>
              </div>
            </div>
            <p className="mt-4 text-[11px] text-[#94a3b8]">*WLTP горимын дагуу.</p>
          </div>
          <div className="relative min-h-[220px] overflow-hidden rounded-2xl bg-[#0b1220]">
            <BatteryCutaway />
          </div>
        </section>

        <section
          id="ota"
          className="scroll-mt-32 flex flex-col rounded-[28px] border border-[#eef2f6] bg-white p-7 shadow-[0_8px_24px_rgba(15,23,42,0.04)] md:p-8 lg:col-span-4"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#94a3b8]">
            OVER-THE-AIR UPDATES
          </p>
          <h3 className="mt-3 text-[26px] font-bold leading-tight tracking-tight text-[#0f172a]">
            Үргэлж шинэчлэгдсэн
          </h3>
          <p className="mt-3 text-[14px] leading-7 text-[#64748b]">
            Програм хангамжийн шинэчлэлийг алсаас хүлээн авч, таны автомашин үргэлж хамгийн
            сүүлийн үеийн боломжуудтай байна.
          </p>
          <div className="relative mt-6 min-h-[180px] flex-1 overflow-hidden rounded-2xl bg-[#f8fafc]">
            <Image
              src={car.image}
              alt={`${car.name} over-the-air updates`}
              fill
              sizes="(min-width: 1024px) 30vw, 100vw"
              className="object-contain p-4"
            />
            <span className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-[#0ea5e9] text-white shadow-lg">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
              </svg>
            </span>
          </div>
          <Link
            href={`/contact?car=${car.slug}`}
            className="mt-5 inline-flex h-10 w-fit items-center gap-2 rounded-xl border border-[#e2e8f0] bg-white px-4 text-[13px] font-semibold text-[#0f172a] hover:border-[#0f172a]"
          >
            Дэлгэрэнгүй <span>→</span>
          </Link>
        </section>
      </div>

      <section className="relative overflow-hidden rounded-[28px] px-7 py-12 text-white md:px-12 md:py-16">
        <Image
          src="/cta-scenic.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[#0b1220]/55" />
        <div className="relative z-10 flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <h3 className="max-w-md text-[32px] font-bold leading-tight tracking-tight md:text-[36px]">
              Ирээдүйн технологи өнөөдрөөс танд
            </h3>
            <p className="mt-3 text-[15px] text-white/80">
              {car.brand} {car.name.replace(car.brand, "").trim()} — Ухаалаг сонголт, илүү сайн
              ирээдүй.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/contact?car=${car.slug}`}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 text-[13px] font-semibold text-[#0f172a] hover:bg-white/90"
            >
              Захиалга өгөх <span>→</span>
            </Link>
            <Link
              href={`/contact?car=${car.slug}&type=testdrive`}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-white/30 bg-[#0b1220]/40 px-5 text-[13px] font-medium text-white hover:bg-[#0b1220]/60"
            >
              Тест драйв захиалах
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
