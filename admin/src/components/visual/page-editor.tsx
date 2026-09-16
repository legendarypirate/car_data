"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, Eye, EyeOff, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploadField } from "@/components/image-upload-field";
import { api } from "@/lib/api";
import {
  blankSection,
  SECTION_TYPES,
  type CmsPage,
  type CmsSection,
  type FooterCms,
  type HeaderCms,
} from "@/lib/cms";
import type { Car } from "@/lib/types";
import { PageCanvas } from "./page-canvas";

export function PageEditor({ slug }: { slug: string }) {
  const [page, setPage] = useState<CmsPage | null>(null);
  const [header, setHeader] = useState<HeaderCms | null>(null);
  const [footer, setFooter] = useState<FooterCms | null>(null);
  const [cars, setCars] = useState<Car[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      api<CmsPage>(`/api/cms/pages/${slug}`),
      api<{ header: HeaderCms; footer: FooterCms }>("/api/cms/chrome"),
      api<Car[]>("/api/cars"),
    ])
      .then(([nextPage, chrome, nextCars]) => {
        setPage(nextPage);
        setHeader(chrome.header);
        setFooter(chrome.footer);
        setCars(nextCars.filter((car) => car.featured).slice(0, 4).length
          ? nextCars.filter((car) => car.featured).slice(0, 4)
          : nextCars.slice(0, 4));
        setSelectedId(nextPage.sections[0]?.id || null);
      })
      .catch((error: Error) => toast.error(error.message));
  }, [slug]);

  const selected = page?.sections.find((section) => section.id === selectedId) || null;

  function updateSections(sections: CmsSection[]) {
    if (!page) return;
    setPage({ ...page, sections });
  }

  function patchSection(id: string, patch: Partial<CmsSection>) {
    if (!page) return;
    updateSections(page.sections.map((section) => (section.id === id ? { ...section, ...patch } : section)));
  }

  function move(id: string, direction: -1 | 1) {
    if (!page) return;
    const index = page.sections.findIndex((section) => section.id === id);
    const next = index + direction;
    if (index < 0 || next < 0 || next >= page.sections.length) return;
    const sections = [...page.sections];
    const [item] = sections.splice(index, 1);
    sections.splice(next, 0, item);
    updateSections(sections);
  }

  async function save() {
    if (!page) return;
    setSaving(true);
    try {
      const saved = await api<CmsPage>(`/api/cms/pages/${slug}`, {
        method: "PUT",
        body: JSON.stringify({ title: page.title, sections: page.sections }),
      });
      setPage(saved);
      toast.success("Нийтийн сайт руу нийтэллээ");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Хадгалж чадсангүй");
    } finally {
      setSaving(false);
    }
  }

  if (!page || !header || !footer) {
    return <p className="p-8 text-sm text-muted-foreground">Хуудас ачаалж байна...</p>;
  }

  return (
    <div className="flex h-[calc(100vh-1px)] flex-col overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b bg-white px-4 py-2.5">
        <div className="flex min-w-0 items-center gap-3">
          <Input
            className="w-40"
            value={page.title}
            onChange={(e) => setPage({ ...page, title: e.target.value })}
          />
          <select
            className="h-8 max-w-[220px] rounded-lg border border-input px-2 text-sm"
            value={selectedId || ""}
            onChange={(e) => setSelectedId(e.target.value)}
          >
            {page.sections.map((section, index) => (
              <option key={section.id} value={section.id}>
                {index + 1}. {SECTION_TYPES.find((item) => item.type === section.type)?.label}
              </option>
            ))}
          </select>
          <select
            className="h-8 rounded-lg border border-input px-2 text-sm"
            defaultValue=""
            onChange={(e) => {
              if (!e.target.value) return;
              const section = blankSection(e.target.value);
              updateSections([...page.sections, section]);
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
        <div className="flex items-center gap-2">
          <p className="hidden text-xs text-muted-foreground xl:block">
            Засахын тулд хуудас дээрх текстийг дарна уу
          </p>
          <Button onClick={save} disabled={saving}>
            {saving ? "Нийтэлж байна..." : "Нийтлэх"}
          </Button>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-[1fr_320px]">
        <div className="overflow-auto bg-[#c5ccd6] p-4">
          <PageCanvas
            header={header}
            footer={footer}
            sections={page.sections}
            cars={cars}
            slug={slug}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onPatchSection={patchSection}
          />
        </div>

        <aside className="overflow-y-auto border-l bg-white p-4">
          {!selected && <p className="text-sm text-muted-foreground">Хуудас дээрх хэсгийг дарна уу.</p>}
          {selected && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">
                  {SECTION_TYPES.find((item) => item.type === selected.type)?.label}
                </h3>
                <div className="flex gap-1">
                  <Button size="icon-sm" variant="ghost" onClick={() => move(selected.id, -1)}>
                    <ArrowUp />
                  </Button>
                  <Button size="icon-sm" variant="ghost" onClick={() => move(selected.id, 1)}>
                    <ArrowDown />
                  </Button>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    onClick={() => patchSection(selected.id, { visible: !selected.visible })}
                  >
                    {selected.visible ? <Eye /> : <EyeOff />}
                  </Button>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    onClick={() => {
                      updateSections(page.sections.filter((section) => section.id !== selected.id));
                      setSelectedId(null);
                    }}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </div>
              <SectionFields section={selected} onChange={(patch) => patchSection(selected.id, patch)} />
            </div>
          )}
        </aside>
      </div>
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

function listFromText(value: string) {
  return value.split("\n").map((line) => line.trim()).filter(Boolean);
}

function SectionFields({
  section,
  onChange,
}: {
  section: CmsSection;
  onChange: (patch: Partial<CmsSection>) => void;
}) {
  const text = (key: string) => String(section[key] ?? "");

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">
        Текстийг хуудас дээр засна. Зургийг файл хуулж оруулна.
      </p>
      {section.image !== undefined && (
        <ImageUploadField
          label="Зураг"
          hint="Файл сонгож хуулна."
          value={text("image")}
          onChange={(image) => onChange({ image })}
        />
      )}
      {section.leftImage !== undefined && (
        <ImageUploadField
          label="Зүүн зураг"
          hint="Файл сонгож хуулна."
          value={text("leftImage")}
          onChange={(leftImage) => onChange({ leftImage })}
        />
      )}
      {["primaryHref", "ctaHref", "leftHref", "rightHref"].map((key) =>
        section[key] !== undefined ? (
          <Field
            key={key}
            label={
              {
                primaryHref: "Үндсэн холбоос",
                ctaHref: "Товчны холбоос",
                leftHref: "Зүүн холбоос",
                rightHref: "Баруун холбоос",
              }[key] || key
            }
          >
            <Input value={text(key)} onChange={(e) => onChange({ [key]: e.target.value })} />
          </Field>
        ) : null,
      )}
      {section.type === "widget" && (
        <Field label="Блок">
          <select
            className="h-8 rounded-lg border border-input px-2.5 text-sm"
            value={text("widget")}
            onChange={(e) => onChange({ widget: e.target.value })}
          >
            <option value="inventory">Машины жагсаалт</option>
            <option value="contact">Холбоо барих форм</option>
            <option value="financing">Санхүүжилт</option>
          </select>
        </Field>
      )}
      {section.type === "brandRow" && (
        <Field label="Брэндийн нэрс">
          <Textarea
            rows={4}
            value={((section.names as string[]) || []).join("\n")}
            onChange={(e) => onChange({ names: listFromText(e.target.value) })}
          />
        </Field>
      )}
      {section.type === "team" &&
        ((section.photos as { src: string; alt?: string }[]) || []).map((photo, index) => (
          <ImageUploadField
            key={index}
            label={`${index + 1}-р зураг`}
            hint="Файл сонгож хуулна."
            value={photo.src}
            onChange={(src) => {
              const photos = [...((section.photos as { src: string; alt?: string }[]) || [])];
              photos[index] = { ...photo, src };
              onChange({ photos });
            }}
          />
        ))}
      {section.type === "brandCards" &&
        ((section.items as { name: string; image: string; href: string; count: string }[]) || []).map((item, index) => (
          <div key={index} className="space-y-2">
            <ImageUploadField
              label={`${item.name} зураг`}
              hint="Файл сонгож хуулна."
              value={item.image}
              onChange={(image) => {
                const items = [...((section.items as object[]) || [])];
                items[index] = { ...item, image };
                onChange({ items });
              }}
            />
            <Field label={`${item.name} холбоос`}>
              <Input
                value={item.href}
                onChange={(e) => {
                  const items = [...((section.items as object[]) || [])];
                  items[index] = { ...item, href: e.target.value };
                  onChange({ items });
                }}
              />
            </Field>
          </div>
        ))}
    </div>
  );
}
