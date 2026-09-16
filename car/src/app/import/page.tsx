import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Import",
  description:
    "How HBT sources Chinese electric cars, ships them, clears customs, and sells them locally.",
};

const stages = [
  {
    title: "Allocation",
    weeks: "Week 0–2",
    copy: "We buy from OEM export desks and bonded lots in Shenzhen, Hefei, Hangzhou, and Changzhou. You are not wiring a stranger. HBT is the importer of record.",
  },
  {
    title: "Compliance file",
    weeks: "Alongside purchase",
    copy: "VIN, battery certificate, conformity documents, and the options list travel with the car. We reject lots that cannot produce a clean export pack.",
  },
  {
    title: "Ocean leg",
    weeks: "2–4 weeks typical",
    copy: "Ro-Ro for volume sedans and SUVs. Containers when a buyer wants a locked spec or a color that should not sit on an open deck.",
  },
  {
    title: "Port, duty, prep",
    weeks: "5–8 days after berth",
    copy: "Customs, duty, transport to our bay. Then a 90-point check: paint, pack health, ADAS calibration, charge curve, and software language.",
  },
  {
    title: "Handover",
    weeks: "Same week",
    copy: "You buy a car that is already here. Title-ready paperwork, home-charger advice, and a two-year HBT mechanical cover on the drivetrain and pack.",
  },
];

export default function ImportPage() {
  return (
    <main className="mx-auto w-full max-w-[1200px] px-5 py-12">
      <h1 className="max-w-3xl text-4xl font-semibold tracking-tight">
        We import. Then we sell.
      </h1>
      <p className="mt-4 max-w-2xl text-[15px] leading-8 text-mute">
        HBT is not a referral site. The cars on this floor crossed the ocean on
        our bill of lading. That is why a Xiaomi can show as “18 days out” and a
        Seal can be driven this Saturday.
      </p>

      <ol className="mt-10">
        {stages.map((stage, index) => (
          <li
            key={stage.title}
            className="grid gap-3 border-t border-line py-7 md:grid-cols-[80px_220px_1fr]"
          >
            <p className="text-2xl font-bold text-brand">
              {String(index + 1).padStart(2, "0")}
            </p>
            <div>
              <h2 className="text-xl font-semibold">{stage.title}</h2>
              <p className="mt-1 text-[12px] text-mute">{stage.weeks}</p>
            </div>
            <p className="text-sm leading-7 text-mute">{stage.copy}</p>
          </li>
        ))}
      </ol>

      <div className="mt-4 grid gap-5 border-t border-line pt-10 md:grid-cols-3">
        {[
          [
            "What the price includes",
            "Purchase, ocean freight, insurance, duty, port handling, and prep. Registration and plates are quoted on the invoice if required.",
          ],
          [
            "What we will not do",
            "Grey-market cars with no battery paperwork. Right-hand conversions. Personal-import schemes that leave you as the importer.",
          ],
          [
            "Factory orders",
            "Color and pack locked at the plant. Typical clock is eight to ten weeks. A deposit holds the slot.",
          ],
        ].map(([title, copy]) => (
          <article
            key={title}
            className="rounded-xl border border-line bg-white p-5"
          >
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="mt-2 text-sm leading-7 text-mute">{copy}</p>
          </article>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/inventory"
          className="inline-flex h-11 items-center rounded-lg bg-brand px-5 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          See what is here
        </Link>
        <Link
          href="/contact"
          className="inline-flex h-11 items-center rounded-lg border border-line px-5 text-sm font-semibold hover:border-brand hover:text-brand"
        >
          Start an order
        </Link>
      </div>
    </main>
  );
}
