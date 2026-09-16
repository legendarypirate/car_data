"use client";

import { useRef, useState } from "react";
import { Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { imageSrc } from "@/lib/api";
import { canUploadToCloudinary, parseImageUrls, uploadToCloudinary } from "@/lib/cloudinary";

export function BrandImageField({
  value,
  onChange,
}: {
  value: string;
  onChange: (image: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const cloudinaryReady = canUploadToCloudinary();

  function apply(paths: string[]) {
    const next = paths[0] || "";
    if (!next) {
      toast.error("Зургийн холбоос оруулна уу");
      return;
    }
    onChange(next);
    setUrl("");
  }

  async function onUpload(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    try {
      const urls = await uploadToCloudinary(files);
      onChange(urls[0] || "");
      toast.success("Зураг хууллаа");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Зураг хуулж чадсангүй");
    } finally {
      setUploading(false);
    }
  }

  return (
    <section className="space-y-3 rounded-xl border bg-[#f8fafc] p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold">Брэндийн зураг</h3>
          <p className="text-xs text-muted-foreground">
            Зургийн холбоос оруулах эсвэл Cloudinary-аас хуулна.
          </p>
        </div>
        {cloudinaryReady && (
          <>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                onUpload(e.target.files);
                e.target.value = "";
              }}
            />
            <Button type="button" variant="outline" disabled={uploading} onClick={() => inputRef.current?.click()}>
              <Upload className="size-4" />
              {uploading ? "Хуулж байна..." : "Зураг хуулах"}
            </Button>
          </>
        )}
      </div>

      {value ? (
        <div className="overflow-hidden rounded-xl bg-white ring-1 ring-black/10">
          <div className="relative aspect-[16/9] max-w-md">
            <img src={imageSrc(value)} alt="" className="h-full w-full object-cover" />
          </div>
          <div className="flex items-center justify-between gap-2 p-3">
            <p className="truncate text-[10px] text-muted-foreground">{value}</p>
            <Button type="button" size="icon-sm" variant="ghost" onClick={() => onChange("")}>
              <Trash2 />
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex h-36 items-center justify-center rounded-xl border border-dashed bg-white text-sm text-muted-foreground">
          Брэндийн зураг алга
        </div>
      )}

      <div className="flex gap-2">
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://res.cloudinary.com/your-cloud/image/upload/v123/brand.jpg"
        />
        <Button type="button" onClick={() => apply(parseImageUrls(url))}>
          Холбоос нэмэх
        </Button>
      </div>
    </section>
  );
}
