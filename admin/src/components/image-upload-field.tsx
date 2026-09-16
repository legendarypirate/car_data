"use client";

import { useRef, useState } from "react";
import { Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { imageSrc, uploadFiles } from "@/lib/api";

export function ImageUploadField({
  value,
  onChange,
  label,
  hint,
  compact = false,
}: {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  hint?: string;
  compact?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);

  async function onUpload(files: FileList | File[] | null) {
    if (!files || !("length" in files) || !files.length) return;
    setUploading(true);
    try {
      const urls = await uploadFiles(files);
      const next = urls[0] || "";
      if (!next) throw new Error("Зураг хуулж чадсангүй");
      onChange(next);
      toast.success("Зураг хууллаа");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Зураг хуулж чадсангүй");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const picker = (
    <input
      ref={inputRef}
      type="file"
      accept="image/*"
      className="hidden"
      onChange={(e) => onUpload(e.target.files)}
    />
  );

  if (compact) {
    return (
      <div className="space-y-1.5">
        {label && <p className="text-xs font-medium text-muted-foreground">{label}</p>}
        <div className="flex items-center gap-2">
          {value ? (
            <img src={imageSrc(value)} alt="" className="h-12 w-20 rounded-md object-cover ring-1 ring-black/10" />
          ) : (
            <div className="flex h-12 w-20 items-center justify-center rounded-md border border-dashed text-[10px] text-muted-foreground">
              Зураг
            </div>
          )}
          {picker}
          <Button type="button" size="sm" variant="outline" disabled={uploading} onClick={() => inputRef.current?.click()}>
            <Upload className="size-3.5" />
            {uploading ? "Хуулж байна..." : value ? "Солих" : "Файл"}
          </Button>
          {value ? (
            <Button type="button" size="icon-sm" variant="ghost" onClick={() => onChange("")}>
              <Trash2 />
            </Button>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {label && <p className="text-sm font-medium">{label}</p>}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      {value ? (
        <div className="overflow-hidden rounded-xl bg-white ring-1 ring-black/10">
          <div className="relative aspect-[16/9] max-w-md">
            <img src={imageSrc(value)} alt="" className="h-full w-full object-cover" />
          </div>
          <div className="flex items-center justify-between gap-2 p-2">
            <p className="truncate text-[10px] text-muted-foreground">{value}</p>
            <Button type="button" size="icon-sm" variant="ghost" onClick={() => onChange("")}>
              <Trash2 />
            </Button>
          </div>
        </div>
      ) : (
        <div
          className={`flex h-28 cursor-pointer items-center justify-center rounded-xl border border-dashed text-sm text-muted-foreground ${
            dragging ? "border-[#0c121d] bg-[#0c121d]/5" : "bg-white"
          }`}
          onClick={() => inputRef.current?.click()}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            onUpload(event.dataTransfer.files);
          }}
        >
          Зураг алга. Файл сонгох эсвэл чирж оруулна.
        </div>
      )}
      {picker}
      <Button type="button" variant="outline" disabled={uploading} onClick={() => inputRef.current?.click()}>
        <Upload className="size-4" />
        {uploading ? "Хуулж байна..." : value ? "Зураг солих" : "Файл хуулах"}
      </Button>
    </div>
  );
}
