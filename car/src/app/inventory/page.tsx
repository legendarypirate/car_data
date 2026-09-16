import type { Metadata } from "next";
import { CmsSections } from "@/components/CmsSections";
import { getCmsPage } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Машинууд | NDA AUTO",
  description:
    "NDA AUTO - Цэвэр цахилгаан болон дэвшилтэт хайбрид автомашинуудын өргөн сонголт, албан ёсны захиалга, баталгаат нийлүүлэлт.",
};

export default async function InventoryPage() {
  const page = await getCmsPage("inventory");
  return (
    <CmsSections
      sections={
        page?.sections?.length
          ? page.sections
          : [
              {
                id: "inv-hero",
                type: "pageHero",
                visible: true,
                image: "/hero-bg.jpg",
                title: "Машинууд",
                subtitle: "Илүү цэвэр, илүү ухаалаг, илүү сайн ирээдүй",
              },
              { id: "inv-list", type: "widget", visible: true, widget: "inventory" },
            ]
      }
    />
  );
}
