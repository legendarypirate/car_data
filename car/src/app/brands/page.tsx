import type { Metadata } from "next";
import { CmsSections } from "@/components/CmsSections";
import { getCmsPage } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Брэндүүд | NDA AUTO",
  description:
    "NDA AUTO - Дэлхийн шилдэг автомашин брэндүүд: Toyota, BYD, Tesla, Zeekr, XPeng, AITO, Li Auto, NIO, BMW, Mercedes-Benz, Audi.",
};

export default async function BrandsPage() {
  const page = await getCmsPage("brands");
  if (!page?.sections?.length) {
    return (
      <main className="py-20 text-center text-mute">
        Энэ хуудсыг админ панел дээр засна уу.
      </main>
    );
  }
  return <CmsSections sections={page.sections} />;
}
