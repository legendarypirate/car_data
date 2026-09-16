"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { uploadFiles } from "@/lib/api";

export function useImagePicker(onChange: (url: string) => void) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  function openPicker() {
    if (uploading) return;
    fileRef.current?.click();
  }

  async function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const urls = await uploadFiles([file]);
      const next = urls[0];
      if (!next) throw new Error("Зураг хуулж чадсангүй");
      onChange(next);
      toast.success("Зураг хууллаа");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Зураг хуулж чадсангүй");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  const input = (
    <input
      ref={fileRef}
      type="file"
      accept="image/*"
      className="hidden"
      onChange={(e) => handleFiles(e.target.files)}
    />
  );

  return { openPicker, uploading, input };
}

export function EditableImage({
  src,
  onChange,
  className,
  imgClassName,
  showButton = true,
}: {
  src: string;
  onChange: (url: string) => void;
  className?: string;
  imgClassName?: string;
  showButton?: boolean;
}) {
  const { openPicker, uploading, input } = useImagePicker(onChange);

  return (
    <>
      <div
        className={cn("group relative block overflow-hidden bg-[#0c121d]", className)}
        onDoubleClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          openPicker();
        }}
      >
        {src ? (
          <img
            src={src}
            alt=""
            className={cn("pointer-events-none h-full w-full object-cover select-none", imgClassName)}
          />
        ) : (
          <div className="flex h-full min-h-[120px] w-full items-center justify-center bg-[#0c121d] text-[11px] text-white/50">
            Зураг сонгоно уу
          </div>
        )}
        {showButton ? (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              openPicker();
            }}
            disabled={uploading}
            className="absolute right-2 bottom-2 z-30 inline-flex items-center gap-1.5 rounded-full bg-black/80 px-3 py-1.5 text-[11px] font-bold text-white shadow-lg ring-1 ring-white/30 hover:bg-white hover:text-black"
          >
            {uploading ? <Loader2 className="size-3.5 animate-spin" /> : <ImagePlus className="size-3.5" />}
            {uploading ? "Хуулж байна..." : "Зураг солих"}
          </button>
        ) : null}
        {uploading ? (
          <span className="absolute inset-0 z-20 flex items-center justify-center bg-black/50">
            <Loader2 className="size-6 animate-spin text-white" />
          </span>
        ) : null}
      </div>
      {input}
    </>
  );
}

export function ChangeImageButton({
  onChange,
  className,
}: {
  onChange: (url: string) => void;
  className?: string;
}) {
  const { openPicker, uploading, input } = useImagePicker(onChange);
  return (
    <>
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          openPicker();
        }}
        disabled={uploading}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-md bg-white px-3 py-1.5 text-[11px] font-bold text-[#0c121d] shadow-lg ring-1 ring-black/10 hover:bg-sky-50",
          className,
        )}
      >
        {uploading ? <Loader2 className="size-3.5 animate-spin" /> : <ImagePlus className="size-3.5" />}
        {uploading ? "Хуулж байна..." : "Зураг солих"}
      </button>
      {input}
    </>
  );
}
