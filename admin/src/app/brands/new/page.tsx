import { BrandForm } from "@/components/brand-form";

export default function NewBrandPage() {
  return (
    <div className="mx-auto max-w-3xl rounded-xl bg-white p-6 ring-1 ring-foreground/10">
      <h2 className="mb-6 text-xl font-semibold">Брэнд нэмэх</h2>
      <BrandForm />
    </div>
  );
}
