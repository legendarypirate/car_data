import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { CarCard } from "@/components/CarCard";
import { ContactSection } from "@/components/ContactSection";
import { FinancingSection } from "@/components/FinancingSection";
import { InventoryBrowser } from "@/components/InventoryBrowser";
import { SectionIcon } from "@/components/SectionIcon";
import { getBrands, type Brand } from "@/lib/brands";
import { getLiveCars } from "@/lib/cars";
import type { CmsSection } from "@/lib/cms";
import type { Car } from "@/data/cars";

export async function CmsSections({
  sections,
  defaultCar,
}: {
  sections: CmsSection[];
  defaultCar?: string;
}) {
  const [brands, liveCars] = await Promise.all([getBrands(), getLiveCars()]);
  return (
    <main>
      {sections
        .filter((section) => section.visible !== false)
        .map((section) => (
          <Section
            key={section.id}
            section={section}
            defaultCar={defaultCar}
            brands={brands}
            liveCars={liveCars}
          />
        ))}
    </main>
  );
}

function text(section: CmsSection, key: string) {
  return String(section[key] ?? "");
}

function lines(value: string) {
  return value.split("\n").filter(Boolean);
}

function Section({
  section,
  defaultCar,
  brands,
  liveCars,
}: {
  section: CmsSection;
  defaultCar?: string;
  brands: Brand[];
  liveCars: Car[];
}) {
  if (section.type === "hero") {
    return (
      <section className="relative isolate overflow-hidden bg-dark min-h-[600px] lg:min-h-[680px]">
        <Image src={text(section, "image") || "/hero-bg.jpg"} alt="" fill priority className="object-cover opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-r from-dark/90 via-dark/70 to-dark/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent" />
        <div className="relative mx-auto max-w-[1280px] px-6 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-bold text-white leading-[1.15] tracking-tight">
                {lines(text(section, "title")).map((line) => (
                  <span key={line} className="block">{line}</span>
                ))}
              </h1>
              <p className="mt-5 max-w-md text-[15px] leading-7 text-white/60 whitespace-pre-line">
                {text(section, "subtitle")}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href={text(section, "primaryHref") || "/inventory"}
                  className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 text-[14px] font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
                >
                  {text(section, "primaryLabel")}
                </Link>
                {text(section, "secondaryLabel") && (
                  <Link href="/about" className="text-[14px] text-white/70 hover:text-white">
                    {text(section, "secondaryLabel")}
                  </Link>
                )}
              </div>
            </div>
            <div className="hidden lg:flex justify-end">
              <div className="rounded-xl bg-white/10 backdrop-blur-md border border-white/10 px-5 py-4 text-right">
                <p className="text-[10px] font-semibold tracking-[0.15em] text-white/50 uppercase">
                  {text(section, "badgeEyebrow")}
                </p>
                <p className="text-[10px] text-white/40 uppercase mt-0.5">{text(section, "badgeLine")}</p>
                <p className="mt-2 text-[11px] text-white/40">{text(section, "badgeBrand")}</p>
                <p className="text-3xl font-bold text-white mt-1">{text(section, "badgeName")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (section.type === "features") {
    const items = (section.items as { title: string; desc: string }[]) || [];
    return (
      <section className="border-b border-line bg-white">
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-line">
            {items.map((item) => (
              <div key={item.title} className="flex items-center gap-4 py-6 px-5">
                <div>
                  <p className="text-[14px] font-semibold text-ink">{item.title}</p>
                  <p className="text-[12px] text-mute mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (section.type === "featuredCars") {
    const featured = liveCars.filter((car) => car.featured).slice(0, 4);
    const list = featured.length ? featured : liveCars.slice(0, 4);
    if (!list.length) return null;
    return (
      <section className="bg-canvas">
        <div className="mx-auto max-w-[1280px] px-6 py-16">
          <div className="flex items-end justify-between gap-4 mb-2">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.15em] text-mute uppercase">
                {text(section, "eyebrow")}
              </p>
              <h2 className="mt-2 text-3xl font-bold text-ink tracking-tight">{text(section, "title")}</h2>
            </div>
            <Link
              href={text(section, "ctaHref") || "/inventory"}
              className="hidden sm:inline-flex items-center gap-1 rounded-lg border border-line bg-white px-4 py-2.5 text-[13px] font-medium text-ink hover:border-brand hover:text-brand"
            >
              {text(section, "ctaLabel")}
            </Link>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {list.map((car) => (
              <CarCard key={car.uuid || car.slug} car={car} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (section.type === "brandRow") {
    const names = brands.map((brand) => brand.name);
    if (!names.length) return null;
    return (
      <section className="border-y border-line bg-white">
        <div className="mx-auto max-w-[1280px] px-6 py-10">
          <p className="text-[11px] font-semibold tracking-[0.15em] text-mute uppercase mb-6">
            {text(section, "eyebrow")}
          </p>
          <div className="flex flex-wrap items-center justify-between gap-8">
            {names.map((name) => (
              <span key={name} className="text-lg font-bold text-ink/60">{name}</span>
            ))}
            <Link href={text(section, "ctaHref") || "/brands"} className="text-[13px] font-medium text-mute hover:text-brand">
              {text(section, "ctaLabel")}
            </Link>
          </div>
        </div>
      </section>
    );
  }

  if (section.type === "splitCta") {
    const cards = (section.cards as { title: string; desc: string }[]) || [];
    return (
      <section className="bg-canvas">
        <div className="mx-auto max-w-[1280px] px-6 py-16">
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="relative overflow-hidden rounded-2xl min-h-[420px]">
              <Image src={text(section, "leftImage") || "/cta-scenic.jpg"} alt="" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-0 p-8 text-white">
                <h3 className="text-2xl lg:text-3xl font-bold whitespace-pre-line">{text(section, "leftTitle")}</h3>
                <p className="mt-3 text-[14px] text-white/60 whitespace-pre-line">{text(section, "leftText")}</p>
                <Link
                  href={text(section, "leftHref") || "/about"}
                  className="mt-5 inline-flex h-11 items-center rounded-xl border border-white/20 bg-white/10 px-5 text-[13px] font-semibold"
                >
                  {text(section, "leftLabel")}
                </Link>
              </div>
            </div>
            <div className="rounded-2xl bg-dark p-8 lg:p-10 flex flex-col justify-between text-white">
              <div>
                <p className="text-[11px] font-semibold tracking-[0.15em] text-white/40 uppercase">
                  {text(section, "rightEyebrow")}
                </p>
                <h3 className="mt-4 text-2xl font-bold whitespace-pre-line">{text(section, "rightTitle")}</h3>
                <p className="mt-4 text-[14px] text-white/50 leading-relaxed">{text(section, "rightText")}</p>
              </div>
              <div className="mt-8 grid grid-cols-3 gap-3">
                {cards.map((card) => (
                  <div key={card.title} className="rounded-xl bg-white/5 border border-white/10 p-4 text-center">
                    <p className="text-[13px] font-semibold">{card.title}</p>
                    <p className="mt-1 text-[11px] text-white/40">{card.desc}</p>
                  </div>
                ))}
              </div>
              <Link
                href={text(section, "rightHref") || "/contact"}
                className="mt-6 inline-flex h-11 items-center rounded-xl bg-white px-6 text-[13px] font-semibold text-dark self-start"
              >
                {text(section, "rightLabel")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (section.type === "pageHero") {
    const slogan = (section.slogan as string[]) || [];
    const cinema = text(section, "variant") === "cinema";
    return (
      <section
        className={`relative overflow-hidden bg-[#0c121d] text-white ${
          cinema ? "min-h-[440px] py-24 md:min-h-[560px] md:py-32" : "py-12 md:py-16"
        }`}
      >
        <div className="absolute inset-0">
          <Image
            src={text(section, "image") || "/hero-bg.jpg"}
            alt=""
            fill
            priority={cinema}
            sizes="100vw"
            className={`object-cover ${cinema ? "opacity-55" : "opacity-40"}`}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0c121d] via-[#0c121d]/80 to-[#0c121d]/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c121d] via-transparent to-[#0c121d]/20" />
        </div>
        <div className="relative z-10 mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-8 px-6 md:flex-row md:items-center">
          <div className="max-w-2xl">
            <h1
              className={`font-extrabold tracking-tight ${
                cinema ? "text-5xl md:text-6xl lg:text-[72px]" : "text-4xl md:text-5xl lg:text-6xl"
              }`}
            >
              {text(section, "title")}
            </h1>
            <p className={`mt-4 text-white/75 ${cinema ? "text-base md:text-lg" : "text-sm md:text-base"}`}>
              {text(section, "subtitle")}
            </p>
            {text(section, "description") && (
              <p className="mt-5 max-w-xl text-sm leading-7 text-white/65 md:text-[15px]">
                {text(section, "description")}
              </p>
            )}
          </div>
          <div className="hidden flex-col items-end text-right md:flex">
            {slogan.map((line) => (
              <span key={line} className="mt-0.5 text-[11px] font-bold tracking-[0.32em] text-white/80 uppercase">
                {line}
              </span>
            ))}
            <div className="mt-2 h-[2px] w-8 bg-white/40" />
          </div>
        </div>
      </section>
    );
  }

  if (section.type === "stats") {
    const items = (section.items as { value: string; label: string; icon?: string }[]) || [];
    if (text(section, "variant") === "dark") {
      return (
        <section className="bg-[#0c121d] text-white">
          <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-8 px-6 py-10 lg:grid-cols-4 lg:py-12">
            {items.map((item) => (
              <div key={item.label} className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/15 text-white">
                  <SectionIcon name={item.icon} className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-extrabold tracking-tight md:text-3xl">{item.value}</p>
                  <p className="mt-1 text-[13px] text-white/55">{item.label}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      );
    }
    return (
      <section className="bg-white">
        <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-4 px-6 py-12 lg:grid-cols-4">
          {items.map((item) => (
            <div key={item.label} className="rounded-2xl bg-canvas p-6 text-center">
              <p className="text-3xl font-extrabold text-ink">{item.value}</p>
              <p className="mt-2 text-sm text-mute">{item.label}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (section.type === "storySplit") {
    return (
      <section className="bg-white">
        <div className="mx-auto grid max-w-[1400px] items-center gap-10 px-6 py-16 lg:grid-cols-2 lg:gap-16 lg:py-24">
          <div className="relative min-h-[320px] overflow-hidden rounded-2xl md:min-h-[440px]">
            <Image
              src={text(section, "image") || "/cta-scenic.jpg"}
              alt=""
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            {text(section, "overlay") && (
              <p className="absolute bottom-6 left-6 text-[22px] font-extrabold leading-[1.15] tracking-[0.08em] text-white uppercase whitespace-pre-line md:text-[28px]">
                {text(section, "overlay")}
              </p>
            )}
          </div>
          <div>
            <p className="text-[11px] font-semibold tracking-[0.22em] text-mute uppercase">
              {text(section, "eyebrow")}
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink md:text-4xl">
              {text(section, "title")}
            </h2>
            <p className="mt-5 max-w-lg text-[15px] leading-8 text-mute">{text(section, "body")}</p>
            {text(section, "ctaLabel") && (
              <Link
                href={text(section, "ctaHref") || "#values"}
                className="mt-8 inline-flex items-center gap-2 text-[14px] font-semibold text-ink hover:text-brand"
              >
                {text(section, "ctaLabel")}
                <span aria-hidden>→</span>
              </Link>
            )}
          </div>
        </div>
      </section>
    );
  }

  if (section.type === "valueGrid") {
    const items = (section.items as { icon?: string; title: string; desc: string }[]) || [];
    return (
      <section id="values" className="bg-white">
        <div className="mx-auto max-w-[1400px] px-6 py-8 pb-20">
          <p className="text-[11px] font-semibold tracking-[0.22em] text-mute uppercase">
            {text(section, "eyebrow")}
          </p>
          <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((item) => (
              <div key={item.title}>
                <div className="mb-4 text-ink">
                  <SectionIcon name={item.icon} className="h-7 w-7" />
                </div>
                <h3 className="text-[17px] font-bold text-ink">{item.title}</h3>
                <p className="mt-2 text-[13px] leading-6 text-mute">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (section.type === "timeline") {
    const items = (section.items as { year: string; text: string }[]) || [];
    return (
      <section className="border-y border-line bg-white">
        <div className="mx-auto max-w-[1400px] px-6 py-16">
          <p className="text-[11px] font-semibold tracking-[0.22em] text-mute uppercase">
            {text(section, "eyebrow")}
          </p>
          <div className="relative mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
            <div className="pointer-events-none absolute top-[9px] right-8 left-8 hidden h-px bg-line lg:block" />
            {items.map((item) => (
              <div key={item.year} className="relative">
                <div className="mb-5 hidden h-[18px] items-center lg:flex">
                  <span className="relative z-10 h-2.5 w-2.5 rounded-full bg-ink" />
                </div>
                <p className="text-2xl font-extrabold tracking-tight text-ink">{item.year}</p>
                <p className="mt-3 text-[13px] leading-6 text-mute">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (section.type === "team") {
    const photos = (section.photos as { src: string; alt?: string }[]) || [];
    return (
      <section className="bg-white">
        <div className="mx-auto grid max-w-[1400px] items-center gap-12 px-6 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:py-24">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.22em] text-mute uppercase">
              {text(section, "eyebrow")}
            </p>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-ink md:text-5xl md:leading-[1.15]">
              {text(section, "title")}
            </h2>
            <p className="mt-5 max-w-md text-[15px] leading-8 text-mute">{text(section, "body")}</p>
            <Link
              href={text(section, "ctaHref") || "/contact"}
              className="mt-8 inline-flex h-12 items-center rounded-xl bg-[#0c121d] px-6 text-[14px] font-semibold text-white transition hover:bg-black"
            >
              {text(section, "ctaLabel") || "Холбоо барих"}
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="relative col-span-1 row-span-2 min-h-[280px] overflow-hidden rounded-2xl md:min-h-[420px]">
              <Image
                src={photos[0]?.src || "/hero-bg.jpg"}
                alt={photos[0]?.alt || ""}
                fill
                sizes="(min-width: 1024px) 30vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="relative min-h-[136px] overflow-hidden rounded-2xl md:min-h-[204px]">
              <Image
                src={photos[1]?.src || "/car-toyota-bz3x.jpg"}
                alt={photos[1]?.alt || ""}
                fill
                sizes="(min-width: 1024px) 20vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="relative min-h-[136px] overflow-hidden rounded-2xl md:min-h-[204px]">
              <Image
                src={photos[2]?.src || "/car-byd-sealion7.jpg"}
                alt={photos[2]?.alt || ""}
                fill
                sizes="(min-width: 1024px) 20vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (section.type === "richText") {
    return (
      <section className="bg-white">
        <div className="mx-auto max-w-[800px] px-6 py-16">
          <h2 className="text-3xl font-bold text-ink">{text(section, "heading")}</h2>
          <p className="mt-5 text-[15px] leading-8 text-mute whitespace-pre-line">{text(section, "body")}</p>
        </div>
      </section>
    );
  }

  if (section.type === "featureGrid") {
    const items = (section.items as { title: string; desc: string }[]) || [];
    return (
      <section className="bg-canvas">
        <div className="mx-auto grid max-w-[1400px] gap-4 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <div key={item.title} className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="font-semibold text-ink">{item.title}</p>
              <p className="mt-2 text-sm text-mute">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (section.type === "brandCards") {
    const items = brands.map((brand) => ({
      name: brand.name,
      count: `${brand.carCount ?? 0} загвар`,
      image: brand.image || "/hero-bg.jpg",
      href: `/inventory?brand=${encodeURIComponent(brand.name)}`,
    }));
    if (!items.length) return null;
    return (
      <section className="bg-[#f8fafc]">
        <div className="mx-auto grid max-w-[1400px] gap-5 px-6 py-10 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Link key={item.name} href={item.href} className="overflow-hidden rounded-2xl bg-white shadow-sm">
              <div className="relative aspect-[16/9]">
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              </div>
              <div className="p-4">
                <p className="font-bold text-ink">{item.name}</p>
                <p className="text-sm text-mute">{item.count}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    );
  }

  if (section.type === "widget") {
    const widget = text(section, "widget");
    if (widget === "inventory") {
      return (
        <section className="mx-auto w-full max-w-[1400px] px-6 py-8 bg-[#f8fafc]">
          <Suspense fallback={<div className="py-20 text-center text-sm text-mute">Уншиж байна...</div>}>
            <InventoryBrowser />
          </Suspense>
        </section>
      );
    }
    if (widget === "contact") {
      return (
        <section className="mx-auto w-full max-w-[1400px] px-6 py-10 bg-[#f8fafc]">
          <Suspense fallback={<div className="py-20 text-center text-sm text-mute">Уншиж байна...</div>}>
            <ContactSection defaultCar={defaultCar} />
          </Suspense>
        </section>
      );
    }
    if (widget === "financing") {
      return (
        <section className="bg-[#f8fafc]">
          <div className="mx-auto w-full max-w-[1400px] px-6 py-12">
            <FinancingSection />
          </div>
        </section>
      );
    }
  }

  return null;
}
