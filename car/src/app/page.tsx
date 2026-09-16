import { CmsSections } from "@/components/CmsSections";
import { getCmsPage } from "@/lib/cms";

export default async function Home() {
  const page = await getCmsPage("home");
  if (!page?.sections?.length) {
    return (
      <main className="flex min-h-[50vh] items-center justify-center text-mute">
        Нүүр хуудсыг админ панел дээр засна уу.
      </main>
    );
  }
  return <CmsSections sections={page.sections} />;
}
