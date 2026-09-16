"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";

type PageSummary = { slug: string; title: string };

export default function PagesIndex() {
  const [pages, setPages] = useState<PageSummary[]>([]);

  useEffect(() => {
    api<{ pages: PageSummary[] }>("/api/cms")
      .then((data) => setPages(data.pages))
      .catch((error: Error) => toast.error(error.message));
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {pages.map((page) => (
        <Link key={page.slug} href={`/pages/${page.slug}`}>
          <Card className="transition hover:ring-2 hover:ring-[#0c121d]">
            <CardHeader>
              <CardTitle>{page.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              /{page.slug === "home" ? "" : page.slug} хуудсын визуал засвар
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
