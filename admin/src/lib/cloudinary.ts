const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";
const PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "";

export function canUploadToCloudinary() {
  return Boolean(CLOUD && PRESET);
}

export function parseImageUrls(value: string) {
  return value
    .split(/[\s,]+/)
    .map((item) => item.trim())
    .filter((item) => /^https?:\/\//.test(item) || item.startsWith("/"));
}

export async function uploadToCloudinary(files: FileList | File[]) {
  if (!canUploadToCloudinary()) {
    throw new Error("Cloudinary тохиргоо дутуу байна");
  }

  const urls: string[] = [];
  for (const file of Array.from(files)) {
    const body = new FormData();
    body.append("file", file);
    body.append("upload_preset", PRESET);
    body.append("folder", "nda-auto/cars");
    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`, {
      method: "POST",
      body,
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.secure_url) {
      throw new Error(data.error?.message || "Cloudinary-д хуулж чадсангүй");
    }
    urls.push(data.secure_url as string);
  }
  return urls;
}
