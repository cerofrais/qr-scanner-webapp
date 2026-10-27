import EntryForm from "@/components/EntryForm";
import Marigold from "@/components/Marigold";
import { EVENT } from "@/utils/event";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Cover — the flyer's stacked display type on parchment */}
      <header className="bg-parchment border-b-4 border-maroon">
        <div className="mx-auto max-w-5xl px-5 pb-10 pt-6 sm:px-8 sm:pb-14 sm:pt-9">
          <div className="flex items-center justify-between gap-4">
            <p className="eyebrow text-henna">{EVENT.presenter} presents</p>
            <p className="eyebrow hidden text-taupe sm:block">{EVENT.edition}</p>
            <Marigold size={26} className="sm:hidden" />
          </div>

          <div className="mt-7 flex flex-col gap-8 sm:mt-10 sm:flex-row sm:items-center sm:justify-between sm:gap-10">
            <div>
              <h1 className="font-serif font-black leading-[0.82] tracking-tight">
                <span className="display-shadow block text-[3.6rem] text-maroon sm:text-[5.6rem] lg:text-[6.4rem]">
                  {EVENT.nameLead}
                </span>
                <span className="display-shadow mt-1 block text-[3rem] text-olive sm:text-[4.6rem] lg:text-[5.2rem]">
                  {EVENT.nameTail}
                </span>
                <span className="mt-2 block text-2xl font-bold italic text-maroon sm:text-3xl">{EVENT.kicker}</span>
              </h1>

              <p className="mt-6 max-w-lg text-sm leading-relaxed text-ink-soft">{EVENT.blurb}</p>

              <div className="mt-4 flex max-w-lg flex-wrap items-center gap-x-2 gap-y-1.5 text-sm font-medium text-henna">
                {EVENT.categories.map((c, i) => (
                  <span key={c} className="whitespace-nowrap">
                    {c}
                    {i < EVENT.categories.length - 1 && <span className="ml-2 text-marigold">·</span>}
                  </span>
                ))}
              </div>
            </div>

            <Marigold size={150} className="hidden shrink-0 sm:block" />
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="bg-peach px-5 py-2 font-serif text-lg font-bold text-maroon sm:text-xl">
              {EVENT.dateLong}
            </span>
            <span className="font-serif text-lg font-semibold text-olive sm:text-xl">{EVENT.hours}</span>
          </div>
          <p className="eyebrow mt-3 text-umber">
            {EVENT.venue}, {EVENT.city}
          </p>
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto grid max-w-5xl gap-10 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[minmax(0,1fr)_26rem] lg:items-start lg:gap-x-16">
          <section className="lg:col-start-1 lg:row-start-1">
            <p className="eyebrow text-henna">Register</p>
            <h2 className="mt-3 font-serif text-4xl font-bold leading-tight text-ink sm:text-5xl">
              Get your entry pass.
            </h2>
            <p className="mt-4 max-w-md leading-relaxed text-ink-soft">
              Share a few details and we&apos;ll generate your personal QR pass. Show it at the entrance on the day —
              one scan and you&apos;re in.
            </p>
          </section>

          <section className="lg:col-start-2 lg:row-start-1">
            <EntryForm variant="guest" />
          </section>
        </div>
      </main>

      <footer className="bg-maroon text-cream">
        <div className="mx-auto flex max-w-5xl flex-col gap-2 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p className="eyebrow text-dusk">
            {EVENT.name} · {EVENT.dateShort} 2026 · {EVENT.venue}
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
