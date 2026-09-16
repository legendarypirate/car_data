import { redirect } from "next/navigation";

export default function SiteChromePage() {
  redirect("/pages?tab=header");
}
