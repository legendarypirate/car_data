"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { fetchCars } from "@/lib/cars";
import type { Car } from "@/data/cars";

interface ContactSectionProps {
  defaultCar?: string;
}

const faqs = [
  {
    id: 1,
    question: "Машины захиалга хэрхэн хийх вэ?",
    answer:
      "Та манай вэбсайт болон утсаар холбогдон сонирхсон загвараа сонгож, гэрээ байгуулан захиалгаа баталгаажуулна. Бид үйлдвэрээс нийлүүлэлт хүртэлх бүх явцыг бүрэн хариуцан гүйцэтгэнэ.",
  },
  {
    id: 2,
    question: "Хүргэлт болон бүртгэлийн талаар?",
    answer:
      "Захиалсан автомашин Улаанбаатар хотод 14-21 хоногийн дотор ирэх бөгөөд гаалийн бүрдүүлэлт, техникийн хяналтын үзлэг, улсын дугаар авах үйл явцыг бид хариуцан бэлэн болгож хүлээлгэн өгнө.",
  },
  {
    id: 3,
    question: "Төлбөрийн нөхцөл ямар байдаг вэ?",
    answer:
      "Бид бэлэн төлөлт, банкны болон банк бусын бүх төрлийн автолизинг (урьдчилгаа 10-30%, хугацаа 60 сар хүртэл)-ийн хамгийн таатай нөхцөлийг санал болгож байна.",
  },
  {
    id: 4,
    question: "Засвар үйлчилгээ хаана хийдэг вэ?",
    answer:
      "Манай өөрийн албан ёсны сертификэйттэй сервис төв нь цахилгаан болон хайбрид автомашины батерей оношилгоо, програм хангамжийн шинэчлэл, кузов засварын бүрэн үйлчилгээг үзүүлдэг.",
  },
];

export function ContactSection({ defaultCar }: ContactSectionProps) {
  // Form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [selectedCar, setSelectedCar] = useState(defaultCar ?? "");
  const [message, setMessage] = useState("");
  const [agree, setAgree] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [cars, setCars] = useState<Car[]>([]);

  // FAQ Accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    fetchCars().then(setCars);
  }, []);

  const toggleFaq = (id: number) => {
    setOpenFaq((prev) => (prev === id ? null : id));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !message) return;
    setSubmitted(true);
  };

  return (
    <div className="w-full">
      {/* 3-Column Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Col 1: Contact Info */}
        <div className="flex flex-col justify-between rounded-2xl bg-white p-6 shadow-sm border border-[#e2e8f0]">
          <div className="space-y-6">
            <h2 className="text-xl font-bold tracking-tight text-ink">
              Бидэнтэй холбогдох
            </h2>

            {/* Phone */}
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f1f5f9] text-ink">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <div>
                <p className="text-[12px] font-medium text-[#64748b]">Утас</p>
                <a
                  href="tel:+97677778688"
                  className="mt-0.5 block text-[14px] font-bold text-ink hover:text-brand transition-colors"
                >
                  +976 7777 8688
                </a>
                <a
                  href="tel:+97688882020"
                  className="block text-[14px] font-bold text-ink hover:text-brand transition-colors"
                >
                  +976 8888 2020
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f1f5f9] text-ink">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </div>
              <div>
                <p className="text-[12px] font-medium text-[#64748b]">И-мэйл</p>
                <a
                  href="mailto:info@ndaauto.mn"
                  className="mt-0.5 block text-[14px] font-bold text-ink hover:text-brand transition-colors"
                >
                  info@ndaauto.mn
                </a>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f1f5f9] text-ink">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div>
                <p className="text-[12px] font-medium text-[#64748b]">Хаяг</p>
                <p className="mt-0.5 text-[13px] font-semibold text-ink leading-snug">
                  Улаанбаатар хот, Хан-Уул дүүрэг
                  <br />
                  Яармагийн авто худалдааны төв (Showroom)
                </p>
              </div>
            </div>

            {/* Hours */}
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f1f5f9] text-ink">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div>
                <p className="text-[12px] font-medium text-[#64748b]">
                  Ажлын цаг
                </p>
                <p className="mt-0.5 text-[13px] font-semibold text-ink">
                  Даваа – Ням: 09:00 - 19:00
                </p>
              </div>
            </div>
          </div>

          {/* Social Icons Row */}
          <div className="mt-8 pt-6 border-t border-[#f1f5f9]">
            <div className="flex items-center gap-3 text-ink">
              {/* Facebook */}
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f1f5f9] transition-all hover:bg-[#0c121d] hover:text-white"
                aria-label="Facebook"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              {/* Instagram */}
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f1f5f9] transition-all hover:bg-[#0c121d] hover:text-white"
                aria-label="Instagram"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
              {/* YouTube */}
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f1f5f9] transition-all hover:bg-[#0c121d] hover:text-white"
                aria-label="YouTube"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33zM9.75 15.02V8.53l5.7 3.25-5.7 3.24z" />
                </svg>
              </a>
              {/* TikTok */}
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f1f5f9] transition-all hover:bg-[#0c121d] hover:text-white"
                aria-label="TikTok"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5v3a8 8 0 0 1-5-1.7V16a7 7 0 1 1-7-7c.7 0 1.4.1 2 .3V12z" />
                </svg>
              </a>
              {/* WeChat */}
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f1f5f9] transition-all hover:bg-[#0c121d] hover:text-white"
                aria-label="WeChat"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M8.5 4C4.9 4 2 6.5 2 9.5c0 1.7.9 3.2 2.3 4.2l-.6 2.3 2.5-1.3c.7.2 1.5.3 2.3.3.3 0 .7 0 1-.1-.3-.6-.5-1.3-.5-2.1 0-3 2.7-5.4 6-5.4.3 0 .5 0 .8.1C15 5.7 12 4 8.5 4zm6.5 6.4c-3 0-5.5 2.1-5.5 4.8 0 2.6 2.5 4.8 5.5 4.8.7 0 1.3-.1 1.9-.3l2.1 1.1-.5-1.9c1.2-.9 2-2.2 2-3.7 0-2.7-2.5-4.8-5.5-4.8z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Col 2: Send a Message Form */}
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-[#e2e8f0]">
          <h2 className="text-xl font-bold tracking-tight text-ink">
            Бидэнд зурвас илгээх
          </h2>
          <p className="mt-1 text-[13px] text-[#64748b]">
            Доорх маягтыг бөглөж, бид тантай хамгийн түргэн хугацаанд холбогдох
            болно.
          </p>

          {submitted ? (
            <div className="mt-8 rounded-xl bg-emerald-50 border border-emerald-200 p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </div>
              <h3 className="mt-3 text-[15px] font-bold text-emerald-900">
                Таны зурвас амжилттай илгээгдлээ!
              </h3>
              <p className="mt-1 text-[12px] text-emerald-700">
                Манай зөвлөх тантай тун удахгүй утсаар эсвэл и-мэйлээр холбогдох
                болно.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-4 rounded-lg bg-emerald-600 px-4 py-1.5 text-[12px] font-semibold text-white hover:bg-emerald-700"
              >
                Дахин илгээх
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-3.5">
              {/* Name */}
              <div>
                <input
                  type="text"
                  required
                  placeholder="Нэр *"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-[#e2e8f0] bg-white px-3.5 py-2.5 text-[13px] text-ink placeholder-[#94a3b8] outline-none transition-all focus:border-[#0c121d] focus:ring-1 focus:ring-[#0c121d]"
                />
              </div>

              {/* Phone */}
              <div>
                <input
                  type="tel"
                  required
                  placeholder="Утасны дугаар *"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-lg border border-[#e2e8f0] bg-white px-3.5 py-2.5 text-[13px] text-ink placeholder-[#94a3b8] outline-none transition-all focus:border-[#0c121d] focus:ring-1 focus:ring-[#0c121d]"
                />
              </div>

              {/* Email */}
              <div>
                <input
                  type="email"
                  placeholder="И-мэйл"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-[#e2e8f0] bg-white px-3.5 py-2.5 text-[13px] text-ink placeholder-[#94a3b8] outline-none transition-all focus:border-[#0c121d] focus:ring-1 focus:ring-[#0c121d]"
                />
              </div>

              {/* Car selection dropdown */}
              <div className="relative">
                <select
                  value={selectedCar}
                  onChange={(e) => setSelectedCar(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-[#e2e8f0] bg-white px-3.5 py-2.5 text-[13px] text-ink outline-none transition-all focus:border-[#0c121d] focus:ring-1 focus:ring-[#0c121d] cursor-pointer"
                >
                  <option value="">Сонирхож буй машин</option>
                  {cars.map((car) => (
                    <option key={car.slug} value={car.slug}>
                      {car.brand} {car.name}
                    </option>
                  ))}
                  <option value="other">Бусад загвар захиалах</option>
                </select>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8]"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>

              {/* Message */}
              <div>
                <textarea
                  required
                  rows={3}
                  placeholder="Зурвас *"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full rounded-lg border border-[#e2e8f0] bg-white px-3.5 py-2.5 text-[13px] text-ink placeholder-[#94a3b8] outline-none transition-all focus:border-[#0c121d] focus:ring-1 focus:ring-[#0c121d]"
                />
              </div>

              {/* Agreement checkbox */}
              <label className="flex items-center gap-2 text-[11px] text-[#64748b] cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="h-3.5 w-3.5 rounded border-[#cbd5e1] text-[#0c121d] accent-[#0c121d]"
                />
                <span>Би хувийн мэдээллийг боловсруулахыг зөвшөөрч байна.</span>
              </label>

              {/* Submit button */}
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0c121d] py-3 text-[13px] font-bold text-white shadow-md transition-all hover:bg-[#1e293b] active:scale-[0.98]"
              >
                <span>Илгээх</span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </button>
            </form>
          )}
        </div>

        {/* Col 3: Map & Showroom Visit */}
        <div className="flex flex-col gap-4">
          {/* Map Card */}
          <div className="relative overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white p-2 shadow-sm min-h-[220px]">
            {/* Styled Map Canvas Visual */}
            <div className="relative h-[210px] w-full overflow-hidden rounded-xl bg-[#e5eef7]">
              {/* Map background svg illustration with roads and river */}
              <svg
                viewBox="0 0 400 240"
                className="h-full w-full object-cover"
                preserveAspectRatio="none"
              >
                {/* Background Land */}
                <rect width="400" height="240" fill="#f1f5f9" />

                {/* Parks / Greenery */}
                <path
                  d="M10 20 Q 80 10 100 60 Q 60 100 10 80 Z"
                  fill="#e2ece9"
                />
                <text x="25" y="55" fontSize="9" fill="#64748b" fontWeight="600">
                  River Garden
                </text>

                {/* Tuul River */}
                <path
                  d="M-20 140 C 80 120, 200 180, 420 150 L 420 190 C 200 220, 80 160, -20 180 Z"
                  fill="#bae6fd"
                />
                <text x="70" y="160" fontSize="9" fill="#0284c7" fontWeight="600">
                  Туул гол
                </text>

                {/* Main Roads */}
                <path
                  d="M160 0 L 160 240"
                  stroke="#cbd5e1"
                  strokeWidth="12"
                  fill="none"
                />
                <path
                  d="M160 0 L 160 240"
                  stroke="#ffffff"
                  strokeWidth="8"
                  fill="none"
                />

                <path
                  d="M0 80 Q 200 70 400 90"
                  stroke="#cbd5e1"
                  strokeWidth="10"
                  fill="none"
                />
                <path
                  d="M0 80 Q 200 70 400 90"
                  stroke="#ffffff"
                  strokeWidth="6"
                  fill="none"
                />

                {/* Secondary roads */}
                <path
                  d="M260 80 L 260 240"
                  stroke="#e2e8f0"
                  strokeWidth="6"
                  fill="none"
                />
                <path
                  d="M0 200 L 400 200"
                  stroke="#e2e8f0"
                  strokeWidth="6"
                  fill="none"
                />

                <text x="210" y="110" fontSize="9" fill="#64748b">
                  Наадам Center
                </text>
                <text x="215" y="180" fontSize="8" fill="#64748b">
                  Яармагийн гүүр
                </text>
              </svg>

              {/* Showroom Map Pin Popup */}
              <div className="absolute right-4 top-4 z-10 max-w-[200px] rounded-xl bg-white/95 p-3 shadow-md backdrop-blur-sm border border-[#e2e8f0]">
                <div className="flex items-start gap-2">
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0c121d] text-white">
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <circle cx="12" cy="10" r="3" />
                      <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold text-ink">
                      NDA AUTO Showroom
                    </h4>
                    <p className="mt-0.5 text-[9px] text-[#64748b] leading-tight">
                      Улаанбаатар хот, Хан-Уул дүүрэг Яармагийн авто худалдааны
                      төв
                    </p>
                    <a
                      href="https://maps.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1.5 inline-flex items-center gap-1 text-[9px] font-bold text-ink hover:underline"
                    >
                      Газрын зураг дээр харах →
                    </a>
                  </div>
                </div>
              </div>

              {/* Map controls */}
              <div className="absolute right-3 bottom-3 flex flex-col gap-1 rounded-lg bg-white p-0.5 shadow-sm border border-[#e2e8f0]">
                <button
                  type="button"
                  aria-label="Томруулах"
                  className="flex h-5 w-5 items-center justify-center text-[12px] font-bold text-ink hover:bg-[#f1f5f9] rounded"
                >
                  +
                </button>
                <div className="h-[1px] bg-[#e2e8f0]" />
                <button
                  type="button"
                  aria-label="Жижигрүүлэх"
                  className="flex h-5 w-5 items-center justify-center text-[12px] font-bold text-ink hover:bg-[#f1f5f9] rounded"
                >
                  -
                </button>
              </div>
            </div>
          </div>

          {/* Showroom Visit Promo Card */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0c121d] via-[#1a2332] to-[#243042] p-5 text-white shadow-sm">
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div>
                <h3 className="text-[16px] font-bold text-white tracking-tight">
                  Манай шоурумд зочлоорой
                </h3>
                <p className="mt-1 text-[12px] text-white/70 leading-relaxed max-w-xs">
                  Шинэ үеийн автомашинуудыг өөрийн нүдээр үзэж, туршиж
                  мэдрээрэй.
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-white/20 bg-white/10 px-3 text-[11px] font-semibold text-white backdrop-blur-sm transition-all hover:bg-white hover:text-dark"
                >
                  Чиглэл авах
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </a>

                {/* Showroom car graphic badge */}
                <div className="flex items-center gap-1 text-[10px] font-bold tracking-widest text-white/40 uppercase">
                  NDA AUTO
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <section className="mt-16">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-ink">
            Түгээмэл асуултууд
          </h2>
          <Link
            href="/about"
            className="inline-flex items-center gap-1 text-[13px] font-semibold text-ink hover:underline"
          >
            <span>Бүгдийг харах</span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* 2x2 FAQ Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {faqs.map((faq) => {
            const isOpen = openFaq === faq.id;
            return (
              <div
                key={faq.id}
                className="overflow-hidden rounded-xl border border-[#e2e8f0] bg-white transition-all shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(faq.id)}
                  className="flex w-full items-center justify-between p-4 text-left font-bold text-[14px] text-ink hover:text-brand transition-colors"
                >
                  <span>{faq.question}</span>
                  <span
                    className={`ml-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#f1f5f9] text-[16px] text-[#64748b] transition-transform ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </span>
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-[13px] text-[#64748b] leading-relaxed border-t border-[#f1f5f9]">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
