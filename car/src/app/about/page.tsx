import type { Metadata } from "next";
import { CmsSections } from "@/components/CmsSections";
import { ABOUT_SECTIONS, hasAboutLayout } from "@/lib/about";
import { getCmsPage } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Бидний тухай | NDA AUTO",
  description:
    "NDA AUTO нь дэлхийн шилдэг автомашинуудыг Монголын хэрэглэгчдэд хүргэх зорилготой, итгэлтэй, мэргэжлийн баг юм.",
};

export default async function AboutPage() {
  const page = await getCmsPage("about");
  const sections = hasAboutLayout(page?.sections) ? page!.sections : ABOUT_SECTIONS;
  return <CmsSections sections={sections} />;
}
