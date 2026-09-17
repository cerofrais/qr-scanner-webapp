import EntryForm from "@/components/EntryForm";
import Mosaic from "@/components/Mosaic";
import { EVENT, MOODS } from "@/utils/event";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Cover — mirrors the deck's navy grid title slide */}
      <header className="bg-grid text-cream">
        <div className="mx-auto max-w-5xl px-5 pb-10 pt-6 sm:px-8 sm:pb-16 sm:pt-10">
          <div className="flex items-center justify-between gap-4">
            <p className="eyebrow text-gold">{EVENT.presenter} presents</p>
            <p className="eyebrow hidden text-haze sm:block">{EVENT.edition}</p>
            <div className="sm:hidden">
              <Mosaic size={13} gap={3} />
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-7 sm:mt-12 sm:flex-row sm:items-end sm:justify-between sm:gap-10">
            <div>
              <h1 className="font-serif text-[3.9rem] leading-[0.9] tracking-tight sm:text-[6.5rem] lg:text-[7.5rem]">
                {EVENT.name}
              </h1>
              <p className="mt-4 max-w-md font-serif text-xl leading-snug text-gold sm:text-2xl">{EVENT.tagline}</p>
              <p className="mt-6 font-serif text-lg sm:mt-7 sm:text-xl">
                {EVENT.dateLong} · <span className="whitespace-nowrap">{EVENT.hours}</span>
              </p>
              <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-mist">
                {EVENT.venue}, {EVENT.city}. {EVENT.blurb}
              </p>
            </div>
            <div className="hidden pb-2 sm:block">
              <Mosaic size={76} gap={10} />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto grid max-w-5xl gap-10 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[minmax(0,1fr)_26rem] lg:gap-x-16">
          <section className="lg:col-start-1 lg:row-start-1">
            <p className="eyebrow text-brick">Register</p>
            <h2 className="mt-3 font-serif text-4xl leading-tight text-ink sm:text-5xl">Get your entry pass.</h2>
            <p className="mt-4 max-w-md leading-relaxed text-ink-soft">
              Share a few details and we&apos;ll generate your personal QR pass. Show it at the entrance on the day —
              one scan and you&apos;re in.
            </p>
          </section>

          <section className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
            <EntryForm variant="guest" />
          </section>

          <section className="lg:col-start-1 lg:row-start-2">
            <div className="border-t border-rule pt-8">
              <p className="eyebrow text-brick">What&apos;s on the floor</p>
              <h2 className="mt-3 font-serif text-3xl leading-tight text-ink">Nine moods. One floor.</h2>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {MOODS.map((mood) => (
                  <li key={mood.name} className="card border-l-[3px] px-4 py-3.5" style={{ borderLeftColor: mood.color }}>
                    <p className="font-serif text-lg leading-snug text-ink">{mood.name}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-umber">{mood.note}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </main>

      <footer className="bg-navy text-cream">
        <div className="mx-auto flex max-w-5xl flex-col gap-2 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p className="eyebrow text-haze">
            {EVENT.name} · 27 September 2026 · {EVENT.venue}
          </p>
          <p className="text-sm text-mist">
            <a href={`mailto:${EVENT.email}`} className="hover:text-cream">
              {EVENT.email}
            </a>{" "}
            · {EVENT.phone}
          </p>
        </div>
      </footer>
    </div>
  );
}
