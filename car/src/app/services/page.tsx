import type { Metadata } from "next";
import { CmsSections } from "@/components/CmsSections";
import { getCmsPage } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Үйлчилгээ & Санхүүжилт | NDA AUTO",
  description:
    "NDA AUTO - Уян хатан санхүүжилт, автолизинг, захиалга, баталгаат засвар үйлчилгээ.",
};

export default async function ServicesPage() {
  const page = await getCmsPage("services");
  if (!page?.sections?.length) {
    return (
      <main className="py-20 text-center text-mute">
        Энэ хуудсыг админ панел дээр засна уу.
      </main>
    );
  }
  return <CmsSections sections={page.sections} />;
}
