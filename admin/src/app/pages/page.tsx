"use client";

import { Suspense } from "react";
import { AppearanceStudio } from "@/components/visual/appearance-studio";

export default function PagesIndex() {
  return (
    <Suspense fallback={<p className="p-8 text-sm text-muted-foreground">Хуудас ачаалж байна...</p>}>
      <AppearanceStudio />
    </Suspense>
  );
}
