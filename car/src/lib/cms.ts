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

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function cmsFetch<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${API_URL}${path}`, {
      next: { revalidate: 5 },
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
