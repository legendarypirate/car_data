import { redirect } from "next/navigation";

export default async function VisualPageEditor({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/pages?tab=${slug}`);
}
