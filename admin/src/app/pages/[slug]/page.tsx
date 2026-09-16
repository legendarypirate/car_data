"use client";

import { useParams } from "next/navigation";
import { PageEditor } from "@/components/visual/page-editor";

export default function VisualPageEditor() {
  const params = useParams<{ slug: string }>();
  return <PageEditor slug={params.slug} />;
}
