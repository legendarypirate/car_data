"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, Eye, EyeOff, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api, publicSiteUrl } from "@/lib/api";
import {
  blankSection,
  SECTION_TYPES,
  type CmsPage,
  type CmsSection,
  type FooterCms,
  type HeaderCms,
} from "@/lib/cms";
import type { Brand, Car } from "@/lib/types";
import { ChromeCanvas, PageCanvas } from "./page-canvas";
import { LinkList } from "./link-list";

const PAGE_ORDER = ["home", "about", "inventory", "brands", "services", "contact"];

function sortPages(pages: CmsPage[]) {
  return [...pages].sort((a, b) => {
    const left = PAGE_ORDER.indexOf(a.slug);
    const right = PAGE_ORDER.indexOf(b.slug);
    return (left < 0 ? 99 : left) - (right < 0 ? 99 : right);
  });
}

export function AppearanceStudio() {
  const searchParams = useSearchParams();
  const [header, setHeader] = useState<HeaderCms | null>(null);
  const [footer, setFooter] = useState<FooterCms | null>(null);
  const [pages, setPages] = useState<CmsPage[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [tab, setTab] = useState(searchParams.get("tab") || "home");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      api<{ header: HeaderCms; footer: FooterCms }>("/api/cms/chrome"),
      api<CmsPage[]>("/api/cms/pages"),
      api<Car[]>("/api/cars").catch(() => [] as Car[]),
      api<Brand[]>("/api/brands").catch(() => [] as Brand[]),
    ])
      .then(([chrome, nextPages, nextCars, nextBrands]) => {
        setHeader(chrome.header);
        setFooter(chrome.footer);
        const sorted = sortPages(nextPages);
        setPages(sorted);
        const featured = nextCars.filter((car) => car.featured).slice(0, 4);
        setCars(featured.length ? featured : nextCars.slice(0, 4));
        setBrands(nextBrands);
        const initial = searchParams.get("tab") || "home";
        const home = sorted.find((page) => page.slug === initial) || sorted[0];
        if (initial === "header" || initial === "footer") {
          setTab(initial);
        } else if (home) {
          setTab(home.slug);
          setSelectedId(home.sections[0]?.id || null);
        }
      })
      .catch((error: Error) => toast.error(error.message));
  }, [searchParams]);

  const currentPage = pages.find((page) => page.slug === tab) || null;
  const selected = currentPage?.sections.find((section) => section.id === selectedId) || null;

  const tabs = useMemo(
    () => [
      { value: "header", label: "Толгой" },
      { value: "footer", label: "Хөл" },
      ...pages.map((page) => ({ value: page.slug, label: page.title })),
    ],
    [pages],
  );

  function updatePage(slug: string, patch: Partial<CmsPage>) {
    setPages((current) => current.map((page) => (page.slug === slug ? { ...page, ...patch } : page)));
  }

  function updateSections(slug: string, sections: CmsSection[]) {
    updatePage(slug, { sections });
  }

  function patchSection(slug: string, id: string, patch: Partial<CmsSection>) {
    const page = pages.find((item) => item.slug === slug);
    if (!page) return;
    updateSections(
      slug,
      page.sections.map((section) => (section.id === id ? { ...section, ...patch } : section)),
    );
  }

  function moveSection(slug: string, id: string, direction: -1 | 1) {
    const page = pages.find((item) => item.slug === slug);
    if (!page) return;
    const index = page.sections.findIndex((section) => section.id === id);
    const next = index + direction;
    if (index < 0 || next < 0 || next >= page.sections.length) return;
    const sections = [...page.sections];
    const [item] = sections.splice(index, 1);
    sections.splice(next, 0, item);
    updateSections(slug, sections);
  }

  async function save() {
    if (!header || !footer) return;
    setSaving(true);
    try {
      await Promise.all([
        api("/api/cms/chrome", {
          method: "PUT",
          body: JSON.stringify({ header, footer }),
        }),
        ...pages.map((page) =>
          api(`/api/cms/pages/${page.slug}`, {
            method: "PUT",
            body: JSON.stringify({ title: page.title, sections: page.sections }),
          }),
        ),
      ]);
      toast.success("Нийтийн сайт руу нийтэллээ");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Хадгалж чадсангүй");
    } finally {
      setSaving(false);
    }
  }

  if (!header || !footer) {
    return <p className="p-8 text-sm text-muted-foreground">Хуудас ачаалж байна...</p>;
  }

  return (
    <div className="flex h-[calc(100vh-1px)] flex-col overflow-hidden bg-[#f4f6f8]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b bg-white px-4 py-2.5">
        <div>
          <h1 className="text-lg font-semibold">Хуудсууд</h1>
          <p className="text-xs text-muted-foreground">
            Текстийг дарж засна, зургийг дарж солино. Машин, брэнд, хүсэлтийг CRUD хэсэгт үлдээнэ.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.open(publicSiteUrl(), "_blank")}>
            Сайтыг харах
          </Button>
          <Button onClick={save} disabled={saving}>
            {saving ? "Нийтэлж байна..." : "Нийтлэх"}
          </Button>
        </div>
      </div>

      <Tabs
        value={tab}
        onValueChange={(value) => {
          const next = String(value ?? "home");
          setTab(next);
          const page = pages.find((item) => item.slug === next);
          setSelectedId(page?.sections[0]?.id || null);
        }}
        className="flex min-h-0 flex-1 flex-col gap-0"
      >
        <div className="border-b bg-white px-4 py-2">
          <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1">
            {tabs.map((item) => (
              <TabsTrigger key={item.value} value={item.value}>
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <div className="min-h-0 flex-1 overflow-auto p-4">
          <TabsContent value="header" className="mt-0 space-y-4">
            <ChromeCanvas
              mode="header"
              header={header}
              footer={footer}
              onHeaderChange={setHeader}
              onFooterChange={setFooter}
            />
            <div className="grid gap-4 xl:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Товч, хайлт</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Field label="Товчны холбоос">
                    <Input
                      value={header.ctaHref}
                      onChange={(e) => setHeader({ ...header, ctaHref: e.target.value })}
                    />
                  </Field>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={header.showSearch}
                      onChange={(e) => setHeader({ ...header, showSearch: e.target.checked })}
                    />
                    Хайлт харуулах
                  </label>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Цэсний холбоос</CardTitle>
                </CardHeader>
                <CardContent>
                  <LinkList title="Цэс" links={header.links} onChange={(links) => setHeader({ ...header, links })} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="footer" className="mt-0 space-y-4">
            <ChromeCanvas
              mode="footer"
              header={header}
              footer={footer}
              onHeaderChange={setHeader}
              onFooterChange={setFooter}
            />
            <div className="grid gap-4 xl:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Багана, хууль</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <LinkList
                    title="1-р багана"
                    links={footer.columns[0]?.links || []}
                    onChange={(links) => {
                      const columns = [...footer.columns];
                      columns[0] = { links };
                      setFooter({ ...footer, columns });
                    }}
                  />
                  <LinkList
                    title="2-р багана"
                    links={footer.columns[1]?.links || []}
                    onChange={(links) => {
                      const columns = [...footer.columns];
                      columns[1] = { links };
                      setFooter({ ...footer, columns });
                    }}
                  />
                  <LinkList
                    title="Хууль эрх зүй"
                    links={footer.legal}
                    onChange={(legal) => setFooter({ ...footer, legal })}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Сошиал холбоос</CardTitle>
                </CardHeader>
                <CardContent>
                  <LinkList
                    title="Сошиал"
                    links={footer.socials.map((item) => ({ label: item.name, href: item.href }))}
                    onChange={(links) =>
                      setFooter({
                        ...footer,
                        socials: links.map((link) => ({ name: link.label, href: link.href })),
                      })
                    }
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {pages.map((page) => (
            <TabsContent key={page.slug} value={page.slug} className="mt-0 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Input
                  className="w-40"
                  value={page.title}
                  onChange={(e) => updatePage(page.slug, { title: e.target.value })}
                />
                <select
                  className="h-8 rounded-lg border border-input px-2 text-sm"
                  defaultValue=""
                  onChange={(e) => {
                    if (!e.target.value) return;
                    const section = blankSection(e.target.value);
                    updateSections(page.slug, [...page.sections, section]);
                    setSelectedId(section.id);
                    e.target.value = "";
                  }}
                >
                  <option value="">Блок нэмэх</option>
                  {SECTION_TYPES.map((item) => (
                    <option key={item.type} value={item.type}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
              <PageCanvas
                header={header}
                footer={footer}
                sections={page.sections}
                cars={cars}
                brands={brands}
                slug={page.slug}
                selectedId={selectedId}
                onSelect={setSelectedId}
                onPatchSection={(id, patch) => patchSection(page.slug, id, patch)}
              />
              {selected && currentPage?.slug === page.slug && (
                <SectionExtras
                  section={selected}
                  onChange={(patch) => patchSection(page.slug, selected.id, patch)}
                  onMove={(direction) => moveSection(page.slug, selected.id, direction)}
                  onToggle={() => patchSection(page.slug, selected.id, { visible: !selected.visible })}
                  onRemove={() => {
                    updateSections(
                      page.slug,
                      page.sections.filter((section) => section.id !== selected.id),
                    );
                    setSelectedId(null);
                  }}
                />
              )}
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1.5">
      <Label>{label}</Label>
      {children}
    </label>
  );
}

function SectionExtras({
  section,
  onChange,
  onMove,
  onToggle,
  onRemove,
}: {
  section: CmsSection;
  onChange: (patch: Partial<CmsSection>) => void;
  onMove: (direction: -1 | 1) => void;
  onToggle: () => void;
  onRemove: () => void;
}) {
  const text = (key: string) => String(section[key] ?? "");
  const crud = section.type === "featuredCars" || section.type === "brandRow" || section.type === "widget";

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>{SECTION_TYPES.find((item) => item.type === section.type)?.label || section.type}</CardTitle>
        <div className="flex gap-1">
          <Button size="icon-sm" variant="ghost" onClick={() => onMove(-1)}>
            <ArrowUp />
          </Button>
          <Button size="icon-sm" variant="ghost" onClick={() => onMove(1)}>
            <ArrowDown />
          </Button>
          <Button size="icon-sm" variant="ghost" onClick={onToggle}>
            {section.visible ? <Eye /> : <EyeOff />}
          </Button>
          <Button size="icon-sm" variant="ghost" onClick={onRemove}>
            <Trash2 />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-xs text-muted-foreground">
          {crud
            ? "Энэ блокны өгөгдөл CRUD-аас ирнэ. Энд зөвхөн гарчиг, товч, холбоос засна."
            : "Текстийг хуудас дээр засна. Зургийг хуудас дээр дарж солино. Энд зөвхөн холбоос үлдэнэ."}
        </p>
        {["primaryHref", "secondaryHref", "ctaHref", "leftHref", "rightHref"].map((key) => {
          const show =
            section[key] !== undefined || (key === "secondaryHref" && section.type === "hero");
          if (!show) return null;
          return (
            <Field
              key={key}
              label={
                {
                  primaryHref: "Үндсэн холбоос",
                  secondaryHref: "Хоёрдох холбоос",
                  ctaHref: "Товчны холбоос",
                  leftHref: "Зүүн холбоос",
                  rightHref: "Баруун холбоос",
                }[key] || key
              }
            >
              <Input value={text(key)} onChange={(e) => onChange({ [key]: e.target.value })} />
            </Field>
          );
        })}
        {section.type === "widget" && (
          <p className="text-sm text-muted-foreground">
            {text("widget") === "inventory" && "Машины жагсаалтыг Машинууд цэсээр удирдана."}
            {text("widget") === "contact" && "Хүсэлтийг Хүсэлтүүд цэсээр хүлээн авна."}
            {text("widget") === "financing" && "Санхүүжилтийн тооцоолуур нийтийн хуудсан дээр ажиллана."}
          </p>
        )}
        {section.type === "features" && (
          <ListEditor
            label="Онцлох мөр"
            items={((section.items as { title: string; desc: string }[]) || []).map((item) => item.title)}
            onAdd={() =>
              onChange({
                items: [
                  ...((section.items as { title: string; desc: string }[]) || []),
                  { icon: "leaf", title: "Шинэ гарчиг", desc: "Тайлбар" },
                ],
              })
            }
            onRemove={(index) => {
              const items = [...((section.items as object[]) || [])];
              items.splice(index, 1);
              onChange({ items });
            }}
          />
        )}
        {section.type === "splitCta" && (
          <ListEditor
            label="Баруун картууд"
            items={((section.cards as { title: string }[]) || []).map((item) => item.title)}
            onAdd={() =>
              onChange({
                cards: [
                  ...((section.cards as { title: string; desc: string }[]) || []),
                  { title: "Карт", desc: "Дэлгэрэнгүй" },
                ],
              })
            }
            onRemove={(index) => {
              const cards = [...((section.cards as object[]) || [])];
              cards.splice(index, 1);
              onChange({ cards });
            }}
          />
        )}
        {section.type === "brandCards" && (
          <div className="space-y-2">
            {((section.items as { name: string; href: string }[]) || []).map((item, index) => (
              <Field key={index} label={`${item.name} холбоос`}>
                <Input
                  value={item.href}
                  onChange={(e) => {
                    const items = [...((section.items as object[]) || [])];
                    items[index] = { ...item, href: e.target.value };
                    onChange({ items });
                  }}
                />
              </Field>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ListEditor({
  label,
  items,
  onAdd,
  onRemove,
}: {
  label: string;
  items: string[];
  onAdd: () => void;
  onRemove: (index: number) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <Button size="sm" variant="outline" onClick={onAdd}>
          <Plus data-icon="inline-start" />
          Нэмэх
        </Button>
      </div>
      {items.map((item, index) => (
        <div key={`${item}-${index}`} className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm">
          <span>{item}</span>
          <Button size="icon-sm" variant="ghost" onClick={() => onRemove(index)}>
            <Trash2 />
          </Button>
        </div>
      ))}
    </div>
  );
}
