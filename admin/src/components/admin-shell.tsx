"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CarFront,
  FilePenLine,
  LayoutDashboard,
  MessageSquareMore,
  PanelTop,
  Tags,
} from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Хянах самбар", icon: LayoutDashboard },
  { href: "/site", label: "Толгой ба хөл", icon: PanelTop },
  { href: "/pages", label: "Хуудсууд", icon: FilePenLine },
  { href: "/cars", label: "Машинууд", icon: CarFront },
  { href: "/brands", label: "Брэндүүд", icon: Tags },
  { href: "/inquiries", label: "Хүсэлтүүд", icon: MessageSquareMore },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isEditor = pathname.startsWith("/pages/") && pathname !== "/pages";

  return (
    <div className="flex min-h-full bg-[#f4f6f8]">
      <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col bg-[#0c121d] text-white">
        <div className="border-b border-white/10 px-5 py-5">
          <p className="text-lg font-extrabold tracking-tight">NDA AUTO</p>
          <p className="mt-1 text-[10px] font-semibold tracking-[0.22em] text-white/50 uppercase">
            Админ
          </p>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3">
          {links.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-white text-[#0c121d]"
                    : "text-white/70 hover:bg-white/10 hover:text-white",
                )}
              >
                <Icon className="size-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-white/10 px-5 py-4 text-xs text-white/40">
          Визуал CMS · car_data
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        {!isEditor && (
          <header className="sticky top-0 z-20 border-b bg-white/90 px-8 py-4 backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  Вэбсайт удирдлага
                </p>
                <h1 className="text-lg font-semibold">
                  {links.find((link) =>
                    link.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(link.href),
                  )?.label || "Админ"}
                </h1>
              </div>
              <a
                href="http://localhost:3000"
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-[#0c121d] px-3 py-1 text-xs font-medium text-white"
              >
                Сайтыг харах
              </a>
            </div>
          </header>
        )}
        <main className={isEditor ? "flex-1" : "flex-1 p-8"}>{children}</main>
      </div>
    </div>
  );
}
