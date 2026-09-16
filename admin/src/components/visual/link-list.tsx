"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { NavLink } from "@/lib/cms";

export function LinkList({
  title,
  links,
  onChange,
}: {
  title: string;
  links: NavLink[];
  onChange: (links: NavLink[]) => void;
}) {
  function update(index: number, patch: Partial<NavLink>) {
    onChange(links.map((link, i) => (i === index ? { ...link, ...patch } : link)));
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>{title}</Label>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onChange([...links, { label: "Шинэ холбоос", href: "/" }])}
        >
          Нэмэх
        </Button>
      </div>
      {links.map((link, index) => (
        <div key={`${link.href}-${index}`} className="grid grid-cols-[1fr_1fr_auto] gap-2">
          <Input value={link.label} onChange={(e) => update(index, { label: e.target.value })} />
          <Input value={link.href} onChange={(e) => update(index, { href: e.target.value })} />
          <Button
            size="icon-sm"
            variant="ghost"
            onClick={() => onChange(links.filter((_, i) => i !== index))}
          >
            ×
          </Button>
        </div>
      ))}
    </div>
  );
}
