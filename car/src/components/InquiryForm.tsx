"use client";

import { FormEvent, useMemo, useState } from "react";
import { cars } from "@/data/cars";

const field =
  "h-11 rounded-lg border border-line bg-white px-3 text-sm outline-none ring-brand/25 focus:border-brand focus:ring-2";

export function InquiryForm({ defaultCar }: { defaultCar?: string }) {
  const [sent, setSent] = useState(false);
  const options = useMemo(
    () => cars.map((car) => `${car.brand} ${car.name}`),
    [],
  );
  const defaultValue = cars.find((car) => car.slug === defaultCar);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  if (sent) {
    return (
      <div className="rounded-xl border border-brand/20 bg-brand/5 px-5 py-6">
        <p className="text-lg font-semibold">Хүсэлт хүлээн авлаа</p>
        <p className="mt-2 text-sm leading-7 text-mute">
          NDA AUTO-ийн зөвлөх тантай холбогдож, машины бэлэн байдал,
          үнийн мэдээлэл, үзлэгийн цагийг мэдэгдэх болно.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-3">
      <label className="grid gap-1.5 text-[13px]">
        <span className="text-mute">Нэр</span>
        <input required name="name" className={field} />
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1.5 text-[13px]">
          <span className="text-mute">Имэйл</span>
          <input required type="email" name="email" className={field} />
        </label>
        <label className="grid gap-1.5 text-[13px]">
          <span className="text-mute">Утас</span>
          <input required type="tel" name="phone" className={field} />
        </label>
      </div>
      <label className="grid gap-1.5 text-[13px]">
        <span className="text-mute">Машин</span>
        <select
          name="car"
          defaultValue={
            defaultValue
              ? `${defaultValue.brand} ${defaultValue.name}`
              : options[0]
          }
          className={field}
        >
          {options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </label>
      <label className="grid gap-1.5 text-[13px]">
        <span className="text-mute">Тэмдэглэл</span>
        <textarea
          name="notes"
          rows={3}
          placeholder="Өнгө, санхүүжилт, солилцоо, хүргэлт"
          className="rounded-lg border border-line bg-white px-3 py-2.5 text-sm outline-none ring-brand/25 focus:border-brand focus:ring-2"
        />
      </label>
      <button
        type="submit"
        className="mt-1 h-11 rounded-lg bg-brand text-sm font-semibold text-white hover:bg-brand-dark"
      >
        Захиалга илгээх
      </button>
    </form>
  );
}
