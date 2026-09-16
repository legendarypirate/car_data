"use client";

import { useState } from "react";
import { ImageUploadField } from "@/components/image-upload-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  TAB_META,
  specsFromCar,
  type CarTabs,
  type DetailItem,
  type GalleryItem,
  type SpecGroup,
  type SpecMetric,
  type TabId,
  type TextPair,
} from "@/lib/car-tabs";

export function CarTabsField({
  tabs,
  gallery,
  carInfo,
  onChange,
}: {
  tabs: CarTabs;
  gallery: string[];
  carInfo: Parameters<typeof specsFromCar>[0];
  onChange: (tabs: CarTabs) => void;
}) {
  const [active, setActive] = useState<TabId>("overview");

  function patch<K extends TabId>(id: K, next: Partial<CarTabs[K]>) {
    onChange({ ...tabs, [id]: { ...tabs[id], ...next } });
  }

  const data = tabs[active];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-1 rounded-xl bg-[#f1f5f9] p-1">
        {TAB_META.map((tab) => {
          const selected = active === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActive(tab.id)}
              className={`rounded-lg px-4 py-2 text-sm transition-colors ${
                selected
                  ? "bg-[#0b1220] font-semibold text-white"
                  : "text-[#64748b] hover:text-[#0f172a]"
              }`}
            >
              {tabs[tab.id].label || tab.name}
              {!tabs[tab.id].visible && (
                <span className="ml-1 text-[10px] opacity-70">· нуусан</span>
              )}
            </button>
          );
        })}
      </div>

      <div className="rounded-xl border bg-[#f8fafc] p-4">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <label className="flex items-center gap-2 text-sm font-semibold">
            <input
              type="checkbox"
              checked={data.visible}
              onChange={(e) => patch(active, { visible: e.target.checked } as Partial<CarTabs[typeof active]>)}
            />
            Сайт дээр харуулах
          </label>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <Field label="Цэсний нэр">
            <Input value={data.label} onChange={(e) => patch(active, { label: e.target.value } as Partial<CarTabs[typeof active]>)} />
          </Field>
          <Field label="Гарчиг">
            <Input value={data.title} onChange={(e) => patch(active, { title: e.target.value } as Partial<CarTabs[typeof active]>)} />
          </Field>
          <Field label="Тайлбар">
            <Input value={data.subtitle} onChange={(e) => patch(active, { subtitle: e.target.value } as Partial<CarTabs[typeof active]>)} />
          </Field>
        </div>

        {active === "overview" && (
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <Field label="Хэсгийн гарчиг">
              <Input
                value={tabs.overview.heading}
                onChange={(e) => patch("overview", { heading: e.target.value })}
              />
            </Field>
            <Field label="Баннерын мөр">
              <Input
                value={tabs.overview.heroLine}
                onChange={(e) => patch("overview", { heroLine: e.target.value })}
              />
            </Field>
            <div className="md:col-span-2">
              <Field label="Баннерын текст">
                <Textarea
                  rows={3}
                  value={tabs.overview.heroText}
                  onChange={(e) => patch("overview", { heroText: e.target.value })}
                />
              </Field>
            </div>
          </div>
        )}

        {active === "design" && (
          <PairsEditor
            items={tabs.design.features}
            onChange={(features) => patch("design", { features })}
          />
        )}

        {active === "interior" && (
          <div className="mt-3 space-y-3">
            <ImageUploadField
              label="Интерьер баннер зураг"
              hint="Файл сонгож хуулна."
              value={tabs.interior.heroImage}
              onChange={(heroImage) => patch("interior", { heroImage })}
            />
            <PairsEditor
              items={tabs.interior.features}
              onChange={(features) => patch("interior", { features })}
            />
            <DetailsEditor
              items={tabs.interior.details}
              onChange={(details) => patch("interior", { details })}
            />
          </div>
        )}

        {active === "technology" && (
          <div className="mt-3 space-y-3">
            <Field label="Хэсгийн гарчиг">
              <Input
                value={tabs.technology.heading}
                onChange={(e) => patch("technology", { heading: e.target.value })}
              />
            </Field>
            <Field label="Текст">
              <Textarea
                rows={3}
                value={tabs.technology.body}
                onChange={(e) => patch("technology", { body: e.target.value })}
              />
            </Field>
            <PairsEditor
              items={tabs.technology.highlights}
              onChange={(highlights) => patch("technology", { highlights })}
            />
          </div>
        )}

        {active === "specs" && (
          <div className="mt-3 space-y-4">
            <Field label="Оршил">
              <Textarea
                rows={2}
                value={tabs.specs.intro}
                onChange={(e) => patch("specs", { intro: e.target.value })}
              />
            </Field>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs text-muted-foreground">
                Хоосон бол сайт дээр машины үндсэн үзүүлэлт харагдана.
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const next = specsFromCar(carInfo);
                  patch("specs", { metrics: next.metrics, groups: next.groups });
                }}
              >
                Үндсэн үзүүлэлтээс бөглөх
              </Button>
            </div>
            <MetricsEditor
              items={tabs.specs.metrics || []}
              onChange={(metrics) => patch("specs", { metrics })}
            />
            <GroupsEditor
              items={tabs.specs.groups || []}
              onChange={(groups) => patch("specs", { groups })}
            />
          </div>
        )}

        {active === "gallery" && (
          <GalleryEditor
            items={tabs.gallery.items}
            gallery={gallery}
            onChange={(items) => patch("gallery", { items })}
          />
        )}
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

function PairsEditor({
  items,
  onChange,
}: {
  items: TextPair[];
  onChange: (items: TextPair[]) => void;
}) {
  return (
    <div className="mt-3 space-y-2">
      <p className="text-xs font-medium text-muted-foreground">Онцлогууд</p>
      {items.map((item, index) => (
        <div key={index} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
          <Input
            value={item.title}
            onChange={(e) => {
              const next = [...items];
              next[index] = { ...item, title: e.target.value };
              onChange(next);
            }}
            placeholder="Гарчиг"
          />
          <Input
            value={item.sub}
            onChange={(e) => {
              const next = [...items];
              next[index] = { ...item, sub: e.target.value };
              onChange(next);
            }}
            placeholder="Тайлбар"
          />
          <Button
            type="button"
            variant="ghost"
            onClick={() => onChange(items.filter((_, i) => i !== index))}
          >
            Устгах
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" onClick={() => onChange([...items, { title: "", sub: "" }])}>
        Мөр нэмэх
      </Button>
    </div>
  );
}

function DetailsEditor({
  items,
  onChange,
}: {
  items: DetailItem[];
  onChange: (items: DetailItem[]) => void;
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-muted-foreground">Дэлгэрэнгүй зураг</p>
      {items.map((item, index) => (
        <div key={index} className="space-y-2 rounded-xl border bg-white p-3">
          <ImageUploadField
            compact
            value={item.image}
            onChange={(image) => {
              const next = [...items];
              next[index] = { ...item, image };
              onChange(next);
            }}
          />
          <div className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
            <Input
              value={item.title}
              onChange={(e) => {
                const next = [...items];
                next[index] = { ...item, title: e.target.value };
                onChange(next);
              }}
              placeholder="Гарчиг"
            />
            <Input
              value={item.sub}
              onChange={(e) => {
                const next = [...items];
                next[index] = { ...item, sub: e.target.value };
                onChange(next);
              }}
              placeholder="Тайлбар"
            />
            <Button
              type="button"
              variant="ghost"
              onClick={() => onChange(items.filter((_, i) => i !== index))}
            >
              Устгах
            </Button>
          </div>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={() => onChange([...items, { image: "", title: "", sub: "" }])}
      >
        Зураг нэмэх
      </Button>
    </div>
  );
}

function GalleryEditor({
  items,
  gallery,
  onChange,
}: {
  items: GalleryItem[];
  gallery: string[];
  onChange: (items: GalleryItem[]) => void;
}) {
  return (
    <div className="mt-3 space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-medium text-muted-foreground">Галлерейн зураг</p>
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            onChange(
              gallery.map((image) => ({
                image,
                tag: "Экстерьер",
                category: "exterior",
                caption: "",
              })),
            )
          }
        >
          Машины зургуудаас үүсгэх
        </Button>
      </div>
      {items.map((item, index) => (
        <div key={index} className="space-y-2 rounded-xl border bg-white p-3">
          <ImageUploadField
            compact
            value={item.image}
            onChange={(image) => {
              const next = [...items];
              next[index] = { ...item, image };
              onChange(next);
            }}
          />
          <div className="grid gap-2 lg:grid-cols-[0.8fr_0.8fr_1fr_auto]">
            <Input
              value={item.tag}
              onChange={(e) => {
                const next = [...items];
                next[index] = { ...item, tag: e.target.value };
                onChange(next);
              }}
              placeholder="Шошго"
            />
            <select
              className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm"
              value={item.category}
              onChange={(e) => {
                const next = [...items];
                next[index] = { ...item, category: e.target.value };
                onChange(next);
              }}
            >
              <option value="exterior">Экстерьер</option>
              <option value="interior">Интерьер</option>
              <option value="detail">Деталь</option>
              <option value="lifestyle">Амьдралын хэв маяг</option>
            </select>
            <Input
              value={item.caption}
              onChange={(e) => {
                const next = [...items];
                next[index] = { ...item, caption: e.target.value };
                onChange(next);
              }}
              placeholder="Тайлбар"
            />
            <Button
              type="button"
              variant="ghost"
              onClick={() => onChange(items.filter((_, i) => i !== index))}
            >
              Устгах
            </Button>
          </div>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={() =>
          onChange([...items, { image: "", tag: "Экстерьер", category: "exterior", caption: "" }])
        }
      >
        Зураг нэмэх
      </Button>
    </div>
  );
}

function MetricsEditor({
  items,
  onChange,
}: {
  items: SpecMetric[];
  onChange: (items: SpecMetric[]) => void;
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-muted-foreground">Дээд үзүүлэлтүүд</p>
      {items.map((item, index) => (
        <div key={index} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
          <Input
            value={item.value}
            onChange={(e) => {
              const next = [...items];
              next[index] = { ...item, value: e.target.value };
              onChange(next);
            }}
            placeholder="Жишээ: 520 км"
          />
          <Input
            value={item.label}
            onChange={(e) => {
              const next = [...items];
              next[index] = { ...item, label: e.target.value };
              onChange(next);
            }}
            placeholder="Жишээ: Явалтын цэнэг"
          />
          <Button type="button" variant="ghost" onClick={() => onChange(items.filter((_, i) => i !== index))}>
            Устгах
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" onClick={() => onChange([...items, { value: "", label: "" }])}>
        Үзүүлэлт нэмэх
      </Button>
    </div>
  );
}

function GroupsEditor({
  items,
  onChange,
}: {
  items: SpecGroup[];
  onChange: (items: SpecGroup[]) => void;
}) {
  function updateGroup(index: number, patch: Partial<SpecGroup>) {
    const next = [...items];
    next[index] = { ...items[index], ...patch };
    onChange(next);
  }

  return (
    <div className="space-y-3">
      <p className="text-xs font-medium text-muted-foreground">Хүснэгтүүд</p>
      {items.map((group, index) => (
        <div key={index} className="space-y-2 rounded-xl border bg-white p-3">
          <div className="flex items-center gap-2">
            <Input
              value={group.title}
              onChange={(e) => updateGroup(index, { title: e.target.value })}
              placeholder="Хэсгийн нэр"
            />
            <Button type="button" variant="ghost" onClick={() => onChange(items.filter((_, i) => i !== index))}>
              Хэсэг устгах
            </Button>
          </div>
          {(group.rows || []).map((row, rowIndex) => (
            <div key={rowIndex} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
              <Input
                value={row.label}
                onChange={(e) => {
                  const rows = [...(group.rows || [])];
                  rows[rowIndex] = { ...row, label: e.target.value };
                  updateGroup(index, { rows });
                }}
                placeholder="Нэр"
              />
              <Input
                value={row.value}
                onChange={(e) => {
                  const rows = [...(group.rows || [])];
                  rows[rowIndex] = { ...row, value: e.target.value };
                  updateGroup(index, { rows });
                }}
                placeholder="Утга"
              />
              <Button
                type="button"
                variant="ghost"
                onClick={() =>
                  updateGroup(index, { rows: (group.rows || []).filter((_, i) => i !== rowIndex) })
                }
              >
                Устгах
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => updateGroup(index, { rows: [...(group.rows || []), { label: "", value: "" }] })}
          >
            Мөр нэмэх
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={() => onChange([...items, { title: "", rows: [{ label: "", value: "" }] }])}
      >
        Хэсэг нэмэх
      </Button>
    </div>
  );
}
