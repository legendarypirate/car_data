import { apiPath } from "@/lib/api-url";

export type NavLink = { label: string; href: string };

export type HeaderCms = {
  brand: string;
  tagline: string;
  links: NavLink[];
  ctaLabel: string;
  ctaHref: string;
  showSearch: boolean;
  langPrimary: string;
  langSecondary: string;
};

export type FooterCms = {
  brand: string;
  tagline: string;
  description: string;
  columns: { links: NavLink[] }[];
  phone: string;
  email: string;
  address: string;
  socials: { name: string; href: string }[];
  slogan: string[];
  copyright: string;
  legal: NavLink[];
};

export type CmsSection = {
  id: string;
  type: string;
  visible?: boolean;
  [key: string]: unknown;
};

export type CmsPage = {
  slug: string;
  title: string;
  sections: CmsSection[];
};

async function cmsFetch<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(apiPath(path), {
      cache: "no-store",
    });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export async function getSiteChrome() {
  return cmsFetch<{ header: HeaderCms; footer: FooterCms }>("/api/cms/chrome");
}

export async function getCmsPage(slug: string) {
  return cmsFetch<CmsPage>(`/api/cms/pages/${slug}`);
}
