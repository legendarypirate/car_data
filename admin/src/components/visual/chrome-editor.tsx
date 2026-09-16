"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import type { FooterCms, HeaderCms } from "@/lib/cms";
import { LinkList } from "./link-list";

type Tab = "header" | "footer";

export function ChromeEditor() {
  const [tab, setTab] = useState<Tab>("header");
  const [header, setHeader] = useState<HeaderCms | null>(null);
  const [footer, setFooter] = useState<FooterCms | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api<{ header: HeaderCms; footer: FooterCms }>("/api/cms/chrome")
      .then((chrome) => {
        setHeader(chrome.header);
        setFooter(chrome.footer);
      })
      .catch((error: Error) => toast.error(error.message));
  }, []);

  async function save() {
    if (!header || !footer) return;
    setSaving(true);
    try {
      await api("/api/cms/chrome", {
        method: "PUT",
        body: JSON.stringify({ header, footer }),
      });
      toast.success("Толгой ба хөлийг нийтэллээ");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Хадгалж чадсангүй");
    } finally {
      setSaving(false);
    }
  }

  if (!header || !footer) {
    return <p className="text-sm text-muted-foreground">Ачаалж байна...</p>;
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1 rounded-xl bg-[#f1f5f9] p-1">
          <button
            type="button"
            onClick={() => setTab("header")}
            className={`rounded-lg px-4 py-2 text-sm ${
              tab === "header" ? "bg-[#0b1220] font-semibold text-white" : "text-[#64748b]"
            }`}
          >
            Толгой
          </button>
          <button
            type="button"
            onClick={() => setTab("footer")}
            className={`rounded-lg px-4 py-2 text-sm ${
              tab === "footer" ? "bg-[#0b1220] font-semibold text-white" : "text-[#64748b]"
            }`}
          >
            Хөл
          </button>
        </div>
        <Button onClick={save} disabled={saving}>
          {saving ? "Нийтэлж байна..." : "Нийтлэх"}
        </Button>
      </div>

      {tab === "header" && (
        <section className="space-y-5 rounded-xl bg-white p-6 ring-1 ring-foreground/10">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Брэнд">
              <Input value={header.brand} onChange={(e) => setHeader({ ...header, brand: e.target.value })} />
            </Field>
            <Field label="Уриа">
              <Input value={header.tagline} onChange={(e) => setHeader({ ...header, tagline: e.target.value })} />
            </Field>
            <Field label="Товчны нэр">
              <Input value={header.ctaLabel} onChange={(e) => setHeader({ ...header, ctaLabel: e.target.value })} />
            </Field>
            <Field label="Товчны холбоос">
              <Input value={header.ctaHref} onChange={(e) => setHeader({ ...header, ctaHref: e.target.value })} />
            </Field>
            <Field label="Үндсэн хэл">
              <Input value={header.langPrimary} onChange={(e) => setHeader({ ...header, langPrimary: e.target.value })} />
            </Field>
            <Field label="Хоёрдох хэл">
              <Input
                value={header.langSecondary}
                onChange={(e) => setHeader({ ...header, langSecondary: e.target.value })}
              />
            </Field>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={header.showSearch}
              onChange={(e) => setHeader({ ...header, showSearch: e.target.checked })}
            />
            Хайлт харуулах
          </label>
          <LinkList title="Цэс" links={header.links} onChange={(links) => setHeader({ ...header, links })} />
        </section>
      )}

      {tab === "footer" && (
        <section className="space-y-5 rounded-xl bg-white p-6 ring-1 ring-foreground/10">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Брэнд">
              <Input value={footer.brand} onChange={(e) => setFooter({ ...footer, brand: e.target.value })} />
            </Field>
            <Field label="Уриа">
              <Input value={footer.tagline} onChange={(e) => setFooter({ ...footer, tagline: e.target.value })} />
            </Field>
            <Field label="Утас">
              <Input value={footer.phone} onChange={(e) => setFooter({ ...footer, phone: e.target.value })} />
            </Field>
            <Field label="Имэйл">
              <Input value={footer.email} onChange={(e) => setFooter({ ...footer, email: e.target.value })} />
            </Field>
            <Field label="Хаяг">
              <Input value={footer.address} onChange={(e) => setFooter({ ...footer, address: e.target.value })} />
            </Field>
            <Field label="Зохиогчийн эрх">
              <Input value={footer.copyright} onChange={(e) => setFooter({ ...footer, copyright: e.target.value })} />
            </Field>
          </div>
          <Field label="Тайлбар">
            <Textarea
              rows={3}
              value={footer.description}
              onChange={(e) => setFooter({ ...footer, description: e.target.value })}
            />
          </Field>
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
          <LinkList title="Хууль эрх зүй" links={footer.legal} onChange={(legal) => setFooter({ ...footer, legal })} />
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
        </section>
      )}
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
