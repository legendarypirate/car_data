import type { Metadata } from "next";
import { PeekArena } from "@/components/PeekArena";

export const metadata: Metadata = {
  title: "Peek drill",
};

export default function PeekPage() {
  return (
    <div className="fixed inset-0 z-[100] bg-black">
      <PeekArena />
    </div>
  );
}
