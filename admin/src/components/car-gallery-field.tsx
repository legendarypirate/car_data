"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Star, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { imageSrc, uploadFiles } from "@/lib/api";
import { canUploadToCloudinary, parseImageUrls, uploadToCloudinary } from "@/lib/cloudinary";

export function CarGalleryField({
  cover,
  gallery,
  onChange,
}: {
  cover: string;
  gallery: string[];
  onChange: (next: { image: string; gallery: string[] }) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [urls, setUrls] = useState("");
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const images = Array.from(new Set([cover, ...gallery].filter(Boolean)));
  const cloudinaryReady = canUploadToCloudinary();

  function commit(nextImages: string[], nextCover = nextImages[0] || "") {
    onChange({ image: nextCover, gallery: nextImages });
  }

  function addPaths(paths: string[]) {
    const next = Array.from(new Set([...images, ...paths]));
    commit(next, cover && next.includes(cover) ? cover : next[0] || "");
  }

  function addFromText() {
    const parsed = parseImageUrls(urls);
    if (!parsed.length) {
      toast.error("Зургийн холбоос эсвэл замыг оруулна уу");
      return;
    }
    addPaths(parsed);
    setUrls("");
  }

  async function onUpload(files: FileList | File[] | null) {
    if (!files || !("length" in files) || !files.length) return;
    setUploading(true);
    try {
      const uploaded = cloudinaryReady
        ? await uploadToCloudinary(files)
        : await uploadFiles(files);
      addPaths(uploaded);
      toast.success(cloudinaryReady ? "Cloudinary-д хууллаа" : `${uploaded.length} зураг нэмэгдлээ`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Хуулж чадсангүй");
    } finally {
      setUploading(false);
    }
  }

  function move(index: number, direction: -1 | 1) {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= images.length) return;
    const next = [...images];
    const [item] = next.splice(index, 1);
    next.splice(nextIndex, 0, item);
    commit(next, cover);
  }

  return (
    <section className="space-y-4">
      <div
        className={`rounded-xl border border-dashed p-6 transition-colors ${
          dragging ? "border-[#0c121d] bg-[#0c121d]/5" : "border-input bg-[#f8fafc]"
        }`}
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
        <div className="flex flex-col items-center justify-center gap-3 text-center sm:flex-row sm:text-left">
          <div className="flex-1">
            <h3 className="text-sm font-semibold">Олон зураг энд чирнэ үү</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Хэд хэдэн зураг нэг дор нэмнэ үү. Одтой зураг нь нүүр зураг болно.
            </p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              onUpload(e.target.files);
              e.target.value = "";
            }}
          />
          <Button type="button" disabled={uploading} onClick={() => inputRef.current?.click()}>
            <Upload className="size-4" />
            {uploading ? "Хуулж байна..." : "Зураг нэмэх"}
          </Button>
        </div>
      </div>

      {images.length === 0 && (
        <div className="flex h-40 items-center justify-center rounded-xl border border-dashed bg-white text-sm text-muted-foreground">
          Зураг алга. Дор хаяж нэг зураг нэмнэ үү.
        </div>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {images.map((src, index) => {
            const isCover = src === cover;
            return (
              <div key={`${src}-${index}`} className="overflow-hidden rounded-xl bg-white ring-1 ring-black/10">
                <div className="relative aspect-video">
                  <img src={imageSrc(src)} alt="" className="h-full w-full object-cover" />
                  {isCover && (
                    <span className="absolute top-2 left-2 rounded-full bg-[#0c121d] px-2 py-0.5 text-[10px] font-semibold text-white">
                      Нүүр
                    </span>
                  )}
                </div>
                <p className="truncate px-2 pt-2 text-[10px] text-muted-foreground">{src}</p>
                <div className="flex items-center justify-between gap-1 p-2">
                  <div className="flex gap-1">
                    <Button type="button" size="icon-sm" variant="ghost" onClick={() => move(index, -1)}>
                      <ChevronLeft />
                    </Button>
                    <Button type="button" size="icon-sm" variant="ghost" onClick={() => move(index, 1)}>
                      <ChevronRight />
                    </Button>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      type="button"
                      size="icon-sm"
                      variant={isCover ? "default" : "ghost"}
                      onClick={() => commit(images, src)}
                    >
                      <Star />
                    </Button>
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="ghost"
                      onClick={() => {
                        const next = images.filter((item) => item !== src);
                        commit(next, cover === src ? next[0] || "" : cover);
                      }}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="grid gap-2">
        <Textarea
          rows={2}
          value={urls}
          onChange={(e) => setUrls(e.target.value)}
          placeholder="Эсвэл зургийн холбоосыг мөр бүрээр оруулна уу"
        />
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">
            {images.length} зураг
            {cover ? " · нүүр зураг сонгосон" : ""}
          </p>
          <Button type="button" variant="outline" onClick={addFromText}>
            Холбоос нэмэх
          </Button>
        </div>
      </div>
    </section>
  );
}
