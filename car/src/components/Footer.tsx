import Link from "next/link";
import type { FooterCms } from "@/lib/cms";

const fallback: FooterCms = {
  brand: "NDA AUTO",
  tagline: "DRIVE A BETTER TOMORROW",
  description: "Илүү цэвэр, илүү ухаалаг, илүү сайн ирээдүй.",
  columns: [
    {
      links: [
        { href: "/", label: "Нүүр" },
        { href: "/inventory", label: "Машинууд" },
        { href: "/brands", label: "Брэндүүд" },
      ],
    },
    {
      links: [
        { href: "/about", label: "Бидний тухай" },
        { href: "/services", label: "Үйлчилгээ" },
        { href: "/contact", label: "Холбоо барих" },
      ],
    },
  ],
  phone: "+976 7777 8688",
  email: "info@ndaauto.mn",
  address: "Улаанбаатар, Монгол",
  socials: [
    { name: "Facebook", href: "#" },
    { name: "Instagram", href: "#" },
    { name: "YouTube", href: "#" },
    { name: "TikTok", href: "#" },
    { name: "WeChat", href: "#" },
  ],
  slogan: ["CLEAN", "SMART", "TOGETHER"],
  copyright: "© 2025 NDA AUTO. Бүх эрх хуулиар хамгаалагдсан.",
  legal: [
    { label: "Нууцлалын бодлого", href: "/about" },
    { label: "Үйлчилгээний нөхцөл", href: "/about" },
  ],
};

export function Footer({ data }: { data?: FooterCms | null }) {
  const footer = data || fallback;

  return (
    <footer className="mt-auto bg-[#0c121d] text-white border-t border-white/5">
      <div className="mx-auto max-w-[1400px] px-6 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5 items-start">
          <div className="lg:col-span-1">
            <Link href="/" className="flex flex-col">
              <span className="text-[20px] font-extrabold tracking-tight text-white leading-tight font-sans">
                {footer.brand}
              </span>
              <span className="text-[8px] font-semibold tracking-[0.25em] text-white/45 uppercase leading-tight mt-0.5">
                {footer.tagline}
              </span>
            </Link>
            <p className="mt-4 text-[12px] text-white/60 leading-relaxed max-w-xs">
              {footer.description}
            </p>
          </div>

          {footer.columns.map((column, index) => (
            <div key={index}>
              <div className="flex flex-col gap-2.5 text-[13px] text-white/70">
                {column.links.map((link) => (
                  <Link key={`${link.href}-${link.label}`} href={link.href} className="transition-colors hover:text-white">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}

          <div>
            <div className="flex flex-col gap-2 text-[13px] text-white/80">
              <p>{footer.phone}</p>
              <p>{footer.email}</p>
              <p>{footer.address}</p>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-[12px] text-white/70">
              {footer.socials.map((social) => (
                <a key={social.name} href={social.href} className="transition-colors hover:text-white">
                  {social.name}
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-start lg:items-end lg:text-right">
            {footer.slogan.map((line) => (
              <span key={line} className="text-[11px] font-bold tracking-[0.3em] text-white/80 uppercase mt-0.5">
                {line}
              </span>
            ))}
            <div className="mt-2 h-[2px] w-8 bg-white/40" />
          </div>
        </div>
      </div>

      <div className="border-t border-white/5 py-4">
        <div className="mx-auto flex max-w-[1400px] flex-col sm:flex-row items-center justify-between gap-3 px-6 text-[12px] text-white/50">
          <p>{footer.copyright}</p>
          <div className="flex items-center gap-6">
            {footer.legal.map((link) => (
              <Link key={link.label} href={link.href} className="hover:text-white transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
