"use client";

import { formatPrice, imageSrc } from "@/lib/api";
import type { Brand, Car } from "@/lib/types";
import type { CmsSection, FooterCms, HeaderCms } from "@/lib/cms";
import { ChangeImageButton, EditableImage } from "./editable-image";
import { Editable } from "./editable-text";

export function PublicHeader({
  header,
  activeHref = "/",
  editable,
  onChange,
}: {
  header: HeaderCms;
  activeHref?: string;
  editable?: boolean;
  onChange?: (header: HeaderCms) => void;
}) {
  const set = (patch: Partial<HeaderCms>) => onChange?.({ ...header, ...patch });

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-[#0c121d]">
      <div className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between gap-4 px-6">
        <div className="flex flex-col">
          {editable ? (
            <>
              <Editable
                as="span"
                value={header.brand}
                onChange={(brand) => set({ brand })}
                className="text-[20px] font-extrabold leading-tight tracking-tight text-white"
              />
              <Editable
                as="span"
                value={header.tagline}
                onChange={(tagline) => set({ tagline })}
                className="text-[8px] font-semibold tracking-[0.25em] text-white/45 uppercase"
              />
            </>
          ) : (
            <>
              <span className="text-[20px] font-extrabold leading-tight tracking-tight text-white">
                {header.brand}
              </span>
              <span className="text-[8px] font-semibold tracking-[0.25em] text-white/45 uppercase">
                {header.tagline}
              </span>
            </>
          )}
        </div>

        <nav className="hidden items-center gap-1 lg:flex">
          {header.links.map((link, index) => {
            const active =
              link.href === "/" ? activeHref === "/" : activeHref.startsWith(link.href);
            return (
              <span
                key={`${link.href}-${index}`}
                className={`relative rounded-md px-4 py-2 text-[14px] ${
                  active
                    ? "font-semibold text-white after:absolute after:right-4 after:bottom-0 after:left-4 after:h-[2px] after:bg-white"
                    : "text-white/70"
                }`}
              >
                {editable ? (
                  <Editable
                    value={link.label}
                    onChange={(label) => {
                      const links = header.links.map((item, i) =>
                        i === index ? { ...item, label } : item,
                      );
                      set({ links });
                    }}
                  />
                ) : (
                  link.label
                )}
              </span>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          {header.showSearch && (
            <span className="flex h-9 w-9 items-center justify-center rounded-lg text-white/70">
              ⌕
            </span>
          )}
          <span className="inline-flex h-9 items-center rounded-lg border border-white/20 bg-white/5 px-4 text-[13px] font-medium text-white">
            {editable ? (
              <Editable value={header.ctaLabel} onChange={(ctaLabel) => set({ ctaLabel })} />
            ) : (
              header.ctaLabel
            )}
          </span>
          <div className="text-[12px] font-medium text-white/60">
            {editable ? (
              <>
                <Editable
                  value={header.langPrimary}
                  onChange={(langPrimary) => set({ langPrimary })}
                  className="font-semibold text-white"
                />
                <span className="mx-1.5 opacity-40">|</span>
                <Editable
                  value={header.langSecondary}
                  onChange={(langSecondary) => set({ langSecondary })}
                />
              </>
            ) : (
              <>
                <span className="font-semibold text-white">{header.langPrimary}</span>
                <span className="mx-1.5 opacity-40">|</span>
                <span>{header.langSecondary}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export function PublicFooter({
  footer,
  editable,
  onChange,
}: {
  footer: FooterCms;
  editable?: boolean;
  onChange?: (footer: FooterCms) => void;
}) {
  const set = (patch: Partial<FooterCms>) => onChange?.({ ...footer, ...patch });

  return (
    <footer className="mt-auto border-t border-white/5 bg-[#0c121d] text-white">
      <div className="mx-auto max-w-[1400px] px-6 py-12">
        <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div>
            {editable ? (
              <>
                <Editable
                  value={footer.brand}
                  onChange={(brand) => set({ brand })}
                  className="text-[20px] font-extrabold tracking-tight"
                />
                <Editable
                  value={footer.tagline}
                  onChange={(tagline) => set({ tagline })}
                  className="mt-0.5 block text-[8px] font-semibold tracking-[0.25em] text-white/45 uppercase"
                />
                <Editable
                  as="p"
                  value={footer.description}
                  onChange={(description) => set({ description })}
                  className="mt-4 max-w-xs text-[12px] leading-relaxed text-white/60"
                />
              </>
            ) : (
              <>
                <p className="text-[20px] font-extrabold tracking-tight">{footer.brand}</p>
                <p className="mt-0.5 text-[8px] font-semibold tracking-[0.25em] text-white/45 uppercase">
                  {footer.tagline}
                </p>
                <p className="mt-4 max-w-xs text-[12px] leading-relaxed text-white/60">
                  {footer.description}
                </p>
              </>
            )}
          </div>

          {footer.columns.map((column, columnIndex) => (
            <div key={columnIndex} className="flex flex-col gap-2.5 text-[13px] text-white/70">
              {column.links.map((link, index) =>
                editable ? (
                  <Editable
                    key={`${columnIndex}-${index}`}
                    value={link.label}
                    onChange={(label) => {
                      const columns = footer.columns.map((item, i) =>
                        i === columnIndex
                          ? {
                              links: item.links.map((entry, j) =>
                                j === index ? { ...entry, label } : entry,
                              ),
                            }
                          : item,
                      );
                      set({ columns });
                    }}
                  />
                ) : (
                  <span key={`${columnIndex}-${index}`}>{link.label}</span>
                ),
              )}
            </div>
          ))}

          <div className="flex flex-col gap-2 text-[13px] text-white/80">
            {editable ? (
              <>
                <Editable value={footer.phone} onChange={(phone) => set({ phone })} />
                <Editable value={footer.email} onChange={(email) => set({ email })} />
                <Editable value={footer.address} onChange={(address) => set({ address })} />
              </>
            ) : (
              <>
                <span>{footer.phone}</span>
                <span>{footer.email}</span>
                <span>{footer.address}</span>
              </>
            )}
            <div className="mt-3 flex flex-wrap gap-3 text-[12px] text-white/70">
              {footer.socials.map((social, index) =>
                editable ? (
                  <Editable
                    key={`${social.name}-${index}`}
                    value={social.name}
                    onChange={(name) => {
                      const socials = footer.socials.map((item, i) =>
                        i === index ? { ...item, name } : item,
                      );
                      set({ socials });
                    }}
                  />
                ) : (
                  <span key={`${social.name}-${index}`}>{social.name}</span>
                ),
              )}
            </div>
          </div>

          <div className="flex flex-col items-start lg:items-end lg:text-right">
            {footer.slogan.map((line, index) =>
              editable ? (
                <Editable
                  key={index}
                  value={line}
                  onChange={(value) => {
                    const slogan = footer.slogan.map((item, i) => (i === index ? value : item));
                    set({ slogan });
                  }}
                  className="text-[11px] font-bold tracking-[0.3em] text-white/80 uppercase"
                />
              ) : (
                <span key={line} className="text-[11px] font-bold tracking-[0.3em] text-white/80 uppercase">
                  {line}
                </span>
              ),
            )}
            <div className="mt-2 h-[2px] w-8 bg-white/40" />
          </div>
        </div>
      </div>
      <div className="border-t border-white/5 py-4">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 text-[12px] text-white/50">
          {editable ? (
            <Editable value={footer.copyright} onChange={(copyright) => set({ copyright })} />
          ) : (
            <p>{footer.copyright}</p>
          )}
          <div className="flex gap-6">
            {footer.legal.map((link, index) =>
              editable ? (
                <Editable
                  key={index}
                  value={link.label}
                  onChange={(label) => {
                    const legal = footer.legal.map((item, i) =>
                      i === index ? { ...item, label } : item,
                    );
                    set({ legal });
                  }}
                />
              ) : (
                <span key={link.label}>{link.label}</span>
              ),
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}

function patch(
  section: CmsSection,
  onChange: ((patch: Partial<CmsSection>) => void) | undefined,
  next: Partial<CmsSection>,
) {
  onChange?.(next);
}

export function PublicSection({
  section,
  cars,
  brands = [],
  selected,
  editable,
  onSelect,
  onChange,
}: {
  section: CmsSection;
  cars: Car[];
  brands?: Brand[];
  selected?: boolean;
  editable?: boolean;
  onSelect?: () => void;
  onChange?: (patch: Partial<CmsSection>) => void;
}) {
  const value = (key: string) => String(section[key] ?? "");
  const set = (key: string, next: string) => patch(section, onChange, { [key]: next });
  const brandNames = brands.length
    ? brands.map((brand) => brand.name)
    : ((section.names as string[]) || []);

  return (
    <div
      onClick={onSelect}
      className={`relative ${selected ? "ring-2 ring-inset ring-sky-400" : ""}`}
    >
      {selected && (
        <span className="absolute top-3 left-3 z-20 rounded-full bg-sky-500 px-2 py-0.5 text-[10px] font-semibold text-white">
          Editing
        </span>
      )}
      {section.type === "hero" && (
        <section className="relative isolate min-h-[600px] overflow-hidden bg-[#0a0f1a] lg:min-h-[680px]">
          {editable ? (
            <EditableImage
              src={imageSrc(value("image") || "/hero-bg.jpg")}
              onChange={(image) => set("image", image)}
              className="absolute inset-0"
              imgClassName="opacity-50"
              showButton={false}
            />
          ) : (
            <div
              className="absolute inset-0 bg-cover bg-center opacity-50"
              style={{ backgroundImage: `url(${imageSrc(value("image") || "/hero-bg.jpg")})` }}
            />
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#0a0f1a]/90 via-[#0a0f1a]/70 to-[#0a0f1a]/40" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a0f1a] via-transparent to-transparent" />
          {editable && (
            <div className="absolute top-4 right-4 z-40">
              <ChangeImageButton onChange={(image) => set("image", image)} />
            </div>
          )}
          <div className="relative mx-auto max-w-[1280px] px-6 py-20 lg:py-28">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                {editable ? (
                  <Editable
                    as="h1"
                    value={value("title")}
                    onChange={(title) => set("title", title)}
                    className="block text-4xl leading-[1.15] font-bold tracking-tight whitespace-pre-line text-white sm:text-5xl lg:text-[54px]"
                  />
                ) : (
                  <h1 className="text-4xl leading-[1.15] font-bold tracking-tight whitespace-pre-line text-white sm:text-5xl lg:text-[54px]">
                    {value("title")}
                  </h1>
                )}
                {editable ? (
                  <Editable
                    as="p"
                    value={value("subtitle")}
                    onChange={(subtitle) => set("subtitle", subtitle)}
                    className="mt-5 block max-w-md text-[15px] leading-7 whitespace-pre-line text-white/60"
                  />
                ) : (
                  <p className="mt-5 max-w-md text-[15px] leading-7 whitespace-pre-line text-white/60">
                    {value("subtitle")}
                  </p>
                )}
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <span className="inline-flex h-12 items-center rounded-xl border border-white/20 bg-white/10 px-6 text-[14px] font-semibold text-white">
                    {editable ? (
                      <Editable value={value("primaryLabel")} onChange={(primaryLabel) => set("primaryLabel", primaryLabel)} />
                    ) : (
                      value("primaryLabel")
                    )}
                  </span>
                  <span className="text-[14px] text-white/70">
                    {editable ? (
                      <Editable value={value("secondaryLabel")} onChange={(secondaryLabel) => set("secondaryLabel", secondaryLabel)} />
                    ) : (
                      value("secondaryLabel")
                    )}
                  </span>
                </div>
              </div>
              <div className="hidden justify-end lg:flex">
                <div className="rounded-xl border border-white/10 bg-white/10 px-5 py-4 text-right backdrop-blur-md">
                  {editable ? (
                    <>
                      <Editable value={value("badgeEyebrow")} onChange={(badgeEyebrow) => set("badgeEyebrow", badgeEyebrow)} className="block text-[10px] font-semibold tracking-[0.15em] text-white/50 uppercase" />
                      <Editable value={value("badgeLine")} onChange={(badgeLine) => set("badgeLine", badgeLine)} className="mt-0.5 block text-[10px] text-white/40 uppercase" />
                      <Editable value={value("badgeBrand")} onChange={(badgeBrand) => set("badgeBrand", badgeBrand)} className="mt-2 block text-[11px] text-white/40" />
                      <Editable value={value("badgeName")} onChange={(badgeName) => set("badgeName", badgeName)} className="mt-1 block text-3xl font-bold text-white" />
                    </>
                  ) : (
                    <>
                      <p className="text-[10px] font-semibold tracking-[0.15em] text-white/50 uppercase">{value("badgeEyebrow")}</p>
                      <p className="mt-0.5 text-[10px] text-white/40 uppercase">{value("badgeLine")}</p>
                      <p className="mt-2 text-[11px] text-white/40">{value("badgeBrand")}</p>
                      <p className="mt-1 text-3xl font-bold text-white">{value("badgeName")}</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {section.type === "features" && (
        <section className="border-b border-[#e6ebf1] bg-white">
          <div className="mx-auto max-w-[1280px] px-6">
            <div className="grid grid-cols-2 divide-x divide-[#e6ebf1] lg:grid-cols-4">
              {((section.items as { title: string; desc: string }[]) || []).map((item, index) => (
                <div key={index} className="flex items-center gap-4 px-5 py-6">
                  <div>
                    {editable ? (
                      <>
                        <Editable
                          value={item.title}
                          onChange={(title) => {
                            const items = [...((section.items as { title: string; desc: string }[]) || [])];
                            items[index] = { ...item, title };
                            onChange?.({ items });
                          }}
                          className="block text-[14px] font-semibold text-[#1a1a2e]"
                        />
                        <Editable
                          value={item.desc}
                          onChange={(desc) => {
                            const items = [...((section.items as { title: string; desc: string }[]) || [])];
                            items[index] = { ...item, desc };
                            onChange?.({ items });
                          }}
                          className="mt-0.5 block text-[12px] text-[#6b7280]"
                        />
                      </>
                    ) : (
                      <>
                        <p className="text-[14px] font-semibold text-[#1a1a2e]">{item.title}</p>
                        <p className="mt-0.5 text-[12px] text-[#6b7280]">{item.desc}</p>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {section.type === "featuredCars" && (
        <section className="bg-[#f7f8fa]">
          <div className="mx-auto max-w-[1280px] px-6 py-16">
            <div className="mb-2 flex items-end justify-between gap-4">
              <div>
                {editable ? (
                  <>
                    <Editable value={value("eyebrow")} onChange={(eyebrow) => set("eyebrow", eyebrow)} className="block text-[11px] font-semibold tracking-[0.15em] text-[#6b7280] uppercase" />
                    <Editable value={value("title")} onChange={(title) => set("title", title)} className="mt-2 block text-3xl font-bold tracking-tight text-[#1a1a2e]" />
                  </>
                ) : (
                  <>
                    <p className="text-[11px] font-semibold tracking-[0.15em] text-[#6b7280] uppercase">{value("eyebrow")}</p>
                    <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#1a1a2e]">{value("title")}</h2>
                  </>
                )}
              </div>
              <span className="rounded-lg border border-[#e6ebf1] bg-white px-4 py-2.5 text-[13px] font-medium text-[#1a1a2e]">
                {editable ? (
                  <Editable value={value("ctaLabel")} onChange={(ctaLabel) => set("ctaLabel", ctaLabel)} />
                ) : (
                  value("ctaLabel")
                )}
              </span>
            </div>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {cars.slice(0, 4).map((car) => (
                <article key={car.id} className="overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white">
                  <div
                    className="aspect-[16/11] bg-cover bg-center bg-[#f1f5f9]"
                    style={{ backgroundImage: `url(${imageSrc(car.image)})` }}
                  />
                  <div className="p-4">
                    <p className="text-[15px] font-bold text-[#1a1a2e]">{car.name}</p>
                    <p className="mt-2 text-[15px] font-extrabold">{formatPrice(Number(car.price))}</p>
                  </div>
                </article>
              ))}
            </div>
            {editable && (
              <p className="mt-4 text-[11px] font-medium tracking-wide text-[#94a3b8] uppercase">
                Машины карт — CRUD өгөгдөл, энд засахгүй
              </p>
            )}
          </div>
        </section>
      )}

      {section.type === "brandRow" && (
        <section className="border-y border-[#e6ebf1] bg-white">
          <div className="mx-auto max-w-[1280px] px-6 py-10">
            {editable ? (
              <Editable value={value("eyebrow")} onChange={(eyebrow) => set("eyebrow", eyebrow)} className="mb-6 block text-[11px] font-semibold tracking-[0.15em] text-[#6b7280] uppercase" />
            ) : (
              <p className="mb-6 text-[11px] font-semibold tracking-[0.15em] text-[#6b7280] uppercase">{value("eyebrow")}</p>
            )}
            <div className="flex flex-wrap items-center justify-between gap-8">
              {brandNames.map((name) => (
                <span key={name} className="text-lg font-bold text-[#1a1a2e]/60">{name}</span>
              ))}
              <span className="text-[13px] font-medium text-[#6b7280]">
                {editable ? (
                  <Editable value={value("ctaLabel")} onChange={(ctaLabel) => set("ctaLabel", ctaLabel)} />
                ) : (
                  value("ctaLabel")
                )}
              </span>
            </div>
            {editable && (
              <p className="mt-4 text-[11px] font-medium tracking-wide text-[#94a3b8] uppercase">
                Брэндийн нэрс — CRUD өгөгдөл, энд засахгүй
              </p>
            )}
          </div>
        </section>
      )}

      {section.type === "splitCta" && (
        <section className="bg-[#f7f8fa]">
          <div className="mx-auto max-w-[1280px] px-6 py-16">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="relative min-h-[420px] overflow-hidden rounded-2xl">
                {editable ? (
                  <EditableImage
                    src={imageSrc(value("leftImage") || "/cta-scenic.jpg")}
                    onChange={(leftImage) => set("leftImage", leftImage)}
                    className="absolute inset-0"
                    showButton={false}
                  />
                ) : (
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${imageSrc(value("leftImage") || "/cta-scenic.jpg")})` }}
                  />
                )}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                {editable && (
                  <div className="absolute top-4 right-4 z-40">
                    <ChangeImageButton onChange={(leftImage) => set("leftImage", leftImage)} />
                  </div>
                )}
                <div className="absolute bottom-0 z-10 p-8 text-white">
                  {editable ? (
                    <>
                      <Editable as="h3" value={value("leftTitle")} onChange={(leftTitle) => set("leftTitle", leftTitle)} className="block text-2xl font-bold whitespace-pre-line lg:text-3xl" />
                      <Editable as="p" value={value("leftText")} onChange={(leftText) => set("leftText", leftText)} className="mt-3 block text-[14px] whitespace-pre-line text-white/60" />
                      <span className="mt-5 inline-flex h-11 items-center rounded-xl border border-white/20 bg-white/10 px-5 text-[13px] font-semibold">
                        <Editable value={value("leftLabel")} onChange={(leftLabel) => set("leftLabel", leftLabel)} />
                      </span>
                    </>
                  ) : (
                    <>
                      <h3 className="text-2xl font-bold whitespace-pre-line lg:text-3xl">{value("leftTitle")}</h3>
                      <p className="mt-3 text-[14px] whitespace-pre-line text-white/60">{value("leftText")}</p>
                      <span className="mt-5 inline-flex h-11 items-center rounded-xl border border-white/20 bg-white/10 px-5 text-[13px] font-semibold">{value("leftLabel")}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex flex-col justify-between rounded-2xl bg-[#0a0f1a] p-8 text-white lg:p-10">
                {editable ? (
                  <>
                    <Editable value={value("rightEyebrow")} onChange={(rightEyebrow) => set("rightEyebrow", rightEyebrow)} className="block text-[11px] font-semibold tracking-[0.15em] text-white/40 uppercase" />
                    <Editable as="h3" value={value("rightTitle")} onChange={(rightTitle) => set("rightTitle", rightTitle)} className="mt-4 block text-2xl font-bold whitespace-pre-line" />
                    <Editable as="p" value={value("rightText")} onChange={(rightText) => set("rightText", rightText)} className="mt-4 block text-[14px] leading-relaxed text-white/50" />
                  </>
                ) : (
                  <>
                    <p className="text-[11px] font-semibold tracking-[0.15em] text-white/40 uppercase">{value("rightEyebrow")}</p>
                    <h3 className="mt-4 text-2xl font-bold whitespace-pre-line">{value("rightTitle")}</h3>
                    <p className="mt-4 text-[14px] leading-relaxed text-white/50">{value("rightText")}</p>
                  </>
                )}
                <div className="mt-8 grid grid-cols-3 gap-3">
                  {((section.cards as { title: string; desc: string }[]) || []).map((card, index) => (
                    <div key={index} className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
                      {editable ? (
                        <>
                          <Editable
                            value={card.title}
                            onChange={(title) => {
                              const cards = [...((section.cards as { title: string; desc: string }[]) || [])];
                              cards[index] = { ...card, title };
                              onChange?.({ cards });
                            }}
                            className="block text-[13px] font-semibold"
                          />
                          <Editable
                            value={card.desc}
                            onChange={(desc) => {
                              const cards = [...((section.cards as { title: string; desc: string }[]) || [])];
                              cards[index] = { ...card, desc };
                              onChange?.({ cards });
                            }}
                            className="mt-1 block text-[11px] text-white/40"
                          />
                        </>
                      ) : (
                        <>
                          <p className="text-[13px] font-semibold">{card.title}</p>
                          <p className="mt-1 text-[11px] text-white/40">{card.desc}</p>
                        </>
                      )}
                    </div>
                  ))}
                </div>
                <span className="mt-6 inline-flex h-11 items-center self-start rounded-xl bg-white px-6 text-[13px] font-semibold text-[#0a0f1a]">
                  {editable ? (
                    <Editable value={value("rightLabel")} onChange={(rightLabel) => set("rightLabel", rightLabel)} />
                  ) : (
                    value("rightLabel")
                  )}
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {section.type === "pageHero" && (
        <section className={`relative overflow-hidden bg-[#0c121d] text-white ${value("variant") === "cinema" ? "min-h-[360px] py-24" : "py-12 md:py-16"}`}>
          {editable ? (
            <EditableImage
              src={imageSrc(value("image") || "/hero-bg.jpg")}
              onChange={(image) => set("image", image)}
              className="absolute inset-0"
              imgClassName={value("variant") === "cinema" ? "opacity-55" : "opacity-40"}
              showButton={false}
            />
          ) : (
            <div
              className={`absolute inset-0 bg-cover bg-center ${value("variant") === "cinema" ? "opacity-55" : "opacity-40"}`}
              style={{ backgroundImage: `url(${imageSrc(value("image") || "/hero-bg.jpg")})` }}
            />
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#0c121d] via-[#0c121d]/80 to-transparent" />
          {editable && (
            <div className="absolute top-4 right-4 z-40">
              <ChangeImageButton onChange={(image) => set("image", image)} />
            </div>
          )}
          <div className="relative z-10 mx-auto flex max-w-[1400px] items-center justify-between gap-6 px-6">
            <div className="max-w-2xl">
              {editable ? (
                <>
                  <Editable as="h1" value={value("title")} onChange={(title) => set("title", title)} className="block text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl" />
                  <Editable as="p" value={value("subtitle")} onChange={(subtitle) => set("subtitle", subtitle)} className="mt-3 block text-base text-white/70" />
                  <Editable as="p" value={value("description")} onChange={(description) => set("description", description)} className="mt-4 block max-w-lg text-sm text-white/70" />
                </>
              ) : (
                <>
                  <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">{value("title")}</h1>
                  <p className="mt-3 text-base text-white/70">{value("subtitle")}</p>
                  {value("description") && <p className="mt-4 max-w-lg text-sm text-white/70">{value("description")}</p>}
                </>
              )}
            </div>
            <div className="hidden flex-col items-end text-right md:flex">
              {((section.slogan as string[]) || []).map((line, index) =>
                editable ? (
                  <Editable
                    key={index}
                    value={line}
                    onChange={(next) => {
                      const slogan = [...((section.slogan as string[]) || [])];
                      slogan[index] = next;
                      onChange?.({ slogan });
                    }}
                    className="text-[11px] font-bold tracking-[0.3em] text-white/80 uppercase"
                  />
                ) : (
                  <span key={line} className="text-[11px] font-bold tracking-[0.3em] text-white/80 uppercase">{line}</span>
                ),
              )}
              <div className="mt-2 h-[2px] w-8 bg-white/40" />
            </div>
          </div>
        </section>
      )}

      {section.type === "stats" && (
        <section className={value("variant") === "dark" ? "bg-[#0c121d] text-white" : "bg-white"}>
          <div className={`mx-auto grid max-w-[1280px] grid-cols-2 gap-4 px-6 py-12 lg:grid-cols-4 ${value("variant") === "dark" ? "max-w-[1400px]" : ""}`}>
            {((section.items as { value: string; label: string }[]) || []).map((item, index) => (
              <div key={index} className={value("variant") === "dark" ? "flex items-center gap-3" : "rounded-2xl bg-[#f7f8fa] p-6 text-center"}>
                {editable ? (
                  <>
                    <Editable
                      value={item.value}
                      onChange={(next) => {
                        const items = [...((section.items as { value: string; label: string }[]) || [])];
                        items[index] = { ...item, value: next };
                        onChange?.({ items });
                      }}
                      className={`block text-3xl font-extrabold ${value("variant") === "dark" ? "text-white" : "text-[#1a1a2e]"}`}
                    />
                    <Editable
                      value={item.label}
                      onChange={(next) => {
                        const items = [...((section.items as { value: string; label: string }[]) || [])];
                        items[index] = { ...item, label: next };
                        onChange?.({ items });
                      }}
                      className={`mt-2 block text-sm ${value("variant") === "dark" ? "text-white/55" : "text-[#6b7280]"}`}
                    />
                  </>
                ) : (
                  <>
                    <p className={`text-3xl font-extrabold ${value("variant") === "dark" ? "text-white" : "text-[#1a1a2e]"}`}>{item.value}</p>
                    <p className={`mt-2 text-sm ${value("variant") === "dark" ? "text-white/55" : "text-[#6b7280]"}`}>{item.label}</p>
                  </>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {section.type === "storySplit" && (
        <section className="bg-white">
          <div className="mx-auto grid max-w-[1400px] items-center gap-10 px-6 py-16 lg:grid-cols-2">
            <div className="relative min-h-[280px] overflow-hidden rounded-2xl">
              {editable ? (
                <EditableImage
                  src={imageSrc(value("image") || "/car-toyota-bz3x.jpg")}
                  onChange={(image) => set("image", image)}
                  className="absolute inset-0"
                />
              ) : (
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${imageSrc(value("image") || "/car-toyota-bz3x.jpg")})` }}
                />
              )}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              {editable ? (
                <Editable as="p" value={value("overlay")} onChange={(overlay) => set("overlay", overlay)} className="absolute bottom-6 left-6 z-10 text-xl font-extrabold uppercase leading-tight text-white whitespace-pre-line" />
              ) : (
                <p className="absolute bottom-6 left-6 z-10 text-xl font-extrabold uppercase leading-tight text-white whitespace-pre-line">{value("overlay")}</p>
              )}
            </div>
            <div>
              {editable ? (
                <>
                  <Editable value={value("eyebrow")} onChange={(eyebrow) => set("eyebrow", eyebrow)} className="block text-[11px] font-semibold tracking-[0.22em] text-[#6b7280] uppercase" />
                  <Editable as="h2" value={value("title")} onChange={(title) => set("title", title)} className="mt-3 block text-3xl font-extrabold text-[#1a1a2e]" />
                  <Editable as="p" value={value("body")} onChange={(body) => set("body", body)} className="mt-5 block text-[15px] leading-8 text-[#6b7280]" />
                  <Editable value={value("ctaLabel")} onChange={(ctaLabel) => set("ctaLabel", ctaLabel)} className="mt-6 block text-sm font-semibold" />
                </>
              ) : (
                <>
                  <p className="text-[11px] font-semibold tracking-[0.22em] text-[#6b7280] uppercase">{value("eyebrow")}</p>
                  <h2 className="mt-3 text-3xl font-extrabold text-[#1a1a2e]">{value("title")}</h2>
                  <p className="mt-5 text-[15px] leading-8 text-[#6b7280]">{value("body")}</p>
                  <p className="mt-6 text-sm font-semibold">{value("ctaLabel")}</p>
                </>
              )}
            </div>
          </div>
        </section>
      )}

      {section.type === "valueGrid" && (
        <section className="bg-white">
          <div className="mx-auto max-w-[1400px] px-6 py-12">
            {editable ? (
              <Editable value={value("eyebrow")} onChange={(eyebrow) => set("eyebrow", eyebrow)} className="block text-[11px] font-semibold tracking-[0.22em] text-[#6b7280] uppercase" />
            ) : (
              <p className="text-[11px] font-semibold tracking-[0.22em] text-[#6b7280] uppercase">{value("eyebrow")}</p>
            )}
            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {((section.items as { title: string; desc: string }[]) || []).map((item, index) => (
                <div key={index}>
                  {editable ? (
                    <>
                      <Editable
                        value={item.title}
                        onChange={(title) => {
                          const items = [...((section.items as { title: string; desc: string }[]) || [])];
                          items[index] = { ...item, title };
                          onChange?.({ items });
                        }}
                        className="block font-bold text-[#1a1a2e]"
                      />
                      <Editable
                        value={item.desc}
                        onChange={(desc) => {
                          const items = [...((section.items as { title: string; desc: string }[]) || [])];
                          items[index] = { ...item, desc };
                          onChange?.({ items });
                        }}
                        className="mt-2 block text-sm text-[#6b7280]"
                      />
                    </>
                  ) : (
                    <>
                      <p className="font-bold text-[#1a1a2e]">{item.title}</p>
                      <p className="mt-2 text-sm text-[#6b7280]">{item.desc}</p>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {section.type === "timeline" && (
        <section className="border-y border-[#e6ebf1] bg-white">
          <div className="mx-auto max-w-[1400px] px-6 py-12">
            {editable ? (
              <Editable value={value("eyebrow")} onChange={(eyebrow) => set("eyebrow", eyebrow)} className="block text-[11px] font-semibold tracking-[0.22em] text-[#6b7280] uppercase" />
            ) : (
              <p className="text-[11px] font-semibold tracking-[0.22em] text-[#6b7280] uppercase">{value("eyebrow")}</p>
            )}
            <div className="mt-10 grid gap-8 lg:grid-cols-5">
              {((section.items as { year: string; text: string }[]) || []).map((item, index) => (
                <div key={index}>
                  {editable ? (
                    <>
                      <Editable
                        value={item.year}
                        onChange={(year) => {
                          const items = [...((section.items as { year: string; text: string }[]) || [])];
                          items[index] = { ...item, year };
                          onChange?.({ items });
                        }}
                        className="block text-2xl font-extrabold text-[#1a1a2e]"
                      />
                      <Editable
                        value={item.text}
                        onChange={(next) => {
                          const items = [...((section.items as { year: string; text: string }[]) || [])];
                          items[index] = { ...item, text: next };
                          onChange?.({ items });
                        }}
                        className="mt-2 block text-sm text-[#6b7280]"
                      />
                    </>
                  ) : (
                    <>
                      <p className="text-2xl font-extrabold text-[#1a1a2e]">{item.year}</p>
                      <p className="mt-2 text-sm text-[#6b7280]">{item.text}</p>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {section.type === "team" && (
        <section className="bg-white">
          <div className="mx-auto grid max-w-[1400px] items-center gap-10 px-6 py-16 lg:grid-cols-2">
            <div>
              {editable ? (
                <>
                  <Editable value={value("eyebrow")} onChange={(eyebrow) => set("eyebrow", eyebrow)} className="block text-[11px] font-semibold tracking-[0.22em] text-[#6b7280] uppercase" />
                  <Editable as="h2" value={value("title")} onChange={(title) => set("title", title)} className="mt-4 block text-4xl font-extrabold text-[#1a1a2e]" />
                  <Editable as="p" value={value("body")} onChange={(body) => set("body", body)} className="mt-5 block text-[15px] leading-8 text-[#6b7280]" />
                  <Editable value={value("ctaLabel")} onChange={(ctaLabel) => set("ctaLabel", ctaLabel)} className="mt-6 inline-flex h-11 items-center rounded-xl bg-[#0c121d] px-5 text-sm font-semibold text-white" />
                </>
              ) : (
                <>
                  <p className="text-[11px] font-semibold tracking-[0.22em] text-[#6b7280] uppercase">{value("eyebrow")}</p>
                  <h2 className="mt-4 text-4xl font-extrabold text-[#1a1a2e]">{value("title")}</h2>
                  <p className="mt-5 text-[15px] leading-8 text-[#6b7280]">{value("body")}</p>
                  <span className="mt-6 inline-flex h-11 items-center rounded-xl bg-[#0c121d] px-5 text-sm font-semibold text-white">{value("ctaLabel")}</span>
                </>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {((section.photos as { src: string }[]) || []).slice(0, 3).map((photo, index) =>
                editable ? (
                  <EditableImage
                    key={index}
                    src={imageSrc(photo.src)}
                    onChange={(src) => {
                      const photos = [...((section.photos as { src: string }[]) || [])];
                      photos[index] = { ...photo, src };
                      onChange?.({ photos });
                    }}
                    className={`rounded-2xl ${index === 0 ? "row-span-2 min-h-[280px]" : "min-h-[132px]"}`}
                  />
                ) : (
                  <div
                    key={index}
                    className={`rounded-2xl bg-cover bg-center ${index === 0 ? "row-span-2 min-h-[280px]" : "min-h-[132px]"}`}
                    style={{ backgroundImage: `url(${imageSrc(photo.src)})` }}
                  />
                ),
              )}
            </div>
          </div>
        </section>
      )}

      {section.type === "richText" && (
        <section className="bg-white">
          <div className="mx-auto max-w-[800px] px-6 py-16">
            {editable ? (
              <>
                <Editable as="h2" value={value("heading")} onChange={(heading) => set("heading", heading)} className="block text-3xl font-bold text-[#1a1a2e]" />
                <Editable as="p" value={value("body")} onChange={(body) => set("body", body)} className="mt-5 block text-[15px] leading-8 whitespace-pre-line text-[#6b7280]" />
              </>
            ) : (
              <>
                <h2 className="text-3xl font-bold text-[#1a1a2e]">{value("heading")}</h2>
                <p className="mt-5 text-[15px] leading-8 whitespace-pre-line text-[#6b7280]">{value("body")}</p>
              </>
            )}
          </div>
        </section>
      )}

      {section.type === "featureGrid" && (
        <section className="bg-[#f7f8fa]">
          <div className="mx-auto grid max-w-[1400px] gap-4 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4">
            {((section.items as { title: string; desc: string }[]) || []).map((item, index) => (
              <div key={index} className="rounded-2xl bg-white p-5 shadow-sm">
                {editable ? (
                  <>
                    <Editable
                      value={item.title}
                      onChange={(title) => {
                        const items = [...((section.items as { title: string; desc: string }[]) || [])];
                        items[index] = { ...item, title };
                        onChange?.({ items });
                      }}
                      className="block font-semibold text-[#1a1a2e]"
                    />
                    <Editable
                      value={item.desc}
                      onChange={(desc) => {
                        const items = [...((section.items as { title: string; desc: string }[]) || [])];
                        items[index] = { ...item, desc };
                        onChange?.({ items });
                      }}
                      className="mt-2 block text-sm text-[#6b7280]"
                    />
                  </>
                ) : (
                  <>
                    <p className="font-semibold text-[#1a1a2e]">{item.title}</p>
                    <p className="mt-2 text-sm text-[#6b7280]">{item.desc}</p>
                  </>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {section.type === "brandCards" && (
        <section className="bg-[#f8fafc]">
          <div className="mx-auto grid max-w-[1400px] gap-5 px-6 py-10 sm:grid-cols-2 lg:grid-cols-3">
            {((section.items as { name: string; count: string; image: string }[]) || []).map((item, index) => (
              <article key={index} className="overflow-hidden rounded-2xl bg-white shadow-sm">
                {editable ? (
                  <EditableImage
                    src={imageSrc(item.image)}
                    onChange={(image) => {
                      const items = [...((section.items as { name: string; count: string; image: string }[]) || [])];
                      items[index] = { ...item, image };
                      onChange?.({ items });
                    }}
                    className="aspect-[16/9]"
                  />
                ) : (
                  <div className="aspect-[16/9] bg-cover bg-center" style={{ backgroundImage: `url(${imageSrc(item.image)})` }} />
                )}
                <div className="p-4">
                  {editable ? (
                    <>
                      <Editable
                        value={item.name}
                        onChange={(name) => {
                          const items = [...((section.items as { name: string; count: string; image: string }[]) || [])];
                          items[index] = { ...item, name };
                          onChange?.({ items });
                        }}
                        className="block font-bold text-[#1a1a2e]"
                      />
                      <Editable
                        value={item.count}
                        onChange={(count) => {
                          const items = [...((section.items as { name: string; count: string; image: string }[]) || [])];
                          items[index] = { ...item, count };
                          onChange?.({ items });
                        }}
                        className="block text-sm text-[#6b7280]"
                      />
                    </>
                  ) : (
                    <>
                      <p className="font-bold text-[#1a1a2e]">{item.name}</p>
                      <p className="text-sm text-[#6b7280]">{item.count}</p>
                    </>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {section.type === "widget" && (
        <section className="bg-[#f8fafc] px-6 py-16">
          <div className="mx-auto max-w-[1400px] rounded-2xl border border-[#e6ebf1] bg-white p-8">
            <p className="text-sm font-semibold text-[#1a1a2e]">
              {value("widget") === "inventory" && "Машины жагсаалт — CRUD өгөгдөл, энд засахгүй"}
              {value("widget") === "contact" && "Холбоо барих форм — CRUD өгөгдөл, энд засахгүй"}
              {value("widget") === "financing" && "Санхүүжилтийн тооцоолуур — CRUD өгөгдөл, энд засахгүй"}
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="h-24 rounded-xl bg-[#f1f5f9]" />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export function PublicPage({
  header,
  footer,
  sections,
  cars,
  brands,
  activeHref,
  selectedId,
  editable,
  chromeEditable,
  onSelect,
  onPatchSection,
  onHeaderChange,
  onFooterChange,
}: {
  header: HeaderCms;
  footer: FooterCms;
  sections: CmsSection[];
  cars: Car[];
  brands?: Brand[];
  activeHref?: string;
  selectedId?: string | null;
  editable?: boolean;
  chromeEditable?: boolean;
  onSelect?: (id: string) => void;
  onPatchSection?: (id: string, patch: Partial<CmsSection>) => void;
  onHeaderChange?: (header: HeaderCms) => void;
  onFooterChange?: (footer: FooterCms) => void;
}) {
  return (
    <div className="flex min-h-full flex-col bg-white font-sans text-[#1a1a2e]">
      <PublicHeader
        header={header}
        activeHref={activeHref}
        editable={chromeEditable}
        onChange={onHeaderChange}
      />
      <main>
        {sections
          .filter((section) => section.visible)
          .map((section) => (
            <PublicSection
              key={section.id}
              section={section}
              cars={cars}
              brands={brands}
              selected={selectedId === section.id}
              editable={editable}
              onSelect={() => onSelect?.(section.id)}
              onChange={(patch) => onPatchSection?.(section.id, patch)}
            />
          ))}
      </main>
      <PublicFooter footer={footer} editable={chromeEditable} onChange={onFooterChange} />
    </div>
  );
}
