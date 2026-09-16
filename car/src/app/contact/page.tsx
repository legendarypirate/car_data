import type { Metadata } from "next";
import { CmsSections } from "@/components/CmsSections";
import { getCmsPage } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Холбоо барих | NDA AUTO",
  description:
    "NDA AUTO-тай холбогдох: Утас, и-мэйл, Яармагийн авто худалдааны төв дахь албан ёсны шоурумын байршил, захиалгын зөвлөгөө.",
};

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ContactPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const car = typeof searchParams.car === "string" ? searchParams.car : undefined;
  const page = await getCmsPage("contact");

  return (
    <CmsSections
      defaultCar={car}
      sections={
        page?.sections?.length
          ? page.sections
          : [
              {
                id: "contact-hero",
                type: "pageHero",
                visible: true,
                image: "/hero-bg.jpg",
                title: "Холбоо барих",
                subtitle: "Таны илүү сайн ирээдүйн төлөө бид үргэлж таны дэргэд.",
              },
              { id: "contact-form", type: "widget", visible: true, widget: "contact" },
            ]
      }
    />
  );
}
