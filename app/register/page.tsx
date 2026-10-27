import EntryForm from "@/components/EntryForm";
import LateCheckoutLogo from "@/components/LateCheckoutLogo";
import Rangoli from "@/components/Rangoli";
import Sparkle from "@/components/Sparkle";
import { EVENT } from "@/utils/event";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Cover — the flyer: corner art, stacked display type, market scene */}
      <header className="bg-parchment relative isolate overflow-hidden border-b-4 border-maroon">
        {/* Decorative art lifted from the flyer, faded into the paper */}
        <img
          src="/art/corner-left.jpg"
          alt=""
          aria-hidden="true"
          className="fade-inward-left pointer-events-none absolute left-0 top-0 -z-10 w-32 select-none sm:w-52 lg:w-64"
        />
        <img
          src="/art/corner-right.jpg"
          alt=""
          aria-hidden="true"
          className="fade-inward-right pointer-events-none absolute right-0 top-0 -z-10 w-32 select-none sm:w-52 lg:w-64"
        />
        <img
          src="/art/market.jpg"
          alt=""
          aria-hidden="true"
          className="fade-upward pointer-events-none absolute inset-x-0 bottom-0 -z-10 hidden h-28 w-full select-none object-cover opacity-80 sm:block lg:h-36"
        />

        <Sparkle size={18} className="absolute left-[18%] top-[22%] -z-10 text-gold opacity-80 sm:size-6" />
        <Sparkle size={14} className="absolute right-[20%] top-[16%] -z-10 text-rose opacity-70 sm:size-5" />
        <Sparkle size={12} className="absolute left-[12%] top-[62%] -z-10 text-marigold opacity-70 sm:size-4" />
        <Sparkle size={16} className="absolute right-[14%] top-[58%] -z-10 text-gold opacity-70 sm:size-5" />

        <div className="mx-auto max-w-3xl px-5 pb-12 pt-7 text-center sm:px-8 sm:pb-20 sm:pt-10">
          <LateCheckoutLogo width={176} className="mx-auto text-maroon sm:w-[210px]" />
          <p className="eyebrow mt-3 text-henna">Presents</p>

          <h1 className="mt-6 font-serif font-black leading-[0.82] tracking-tight sm:mt-8">
            <span className="display-shadow block text-[3.5rem] text-maroon sm:text-[5.4rem] lg:text-[6.2rem]">
              {EVENT.nameLead}
            </span>
            <span className="display-shadow mt-1 block text-[2.9rem] text-olive sm:text-[4.4rem] lg:text-[5rem]">
              {EVENT.nameTail}
            </span>
            <span className="display-shadow mt-2 block text-2xl font-bold italic text-maroon sm:text-4xl">
              {EVENT.kicker}
            </span>
          </h1>

          <div className="mx-auto mt-7 flex max-w-xl flex-wrap items-center justify-center gap-x-2 gap-y-1.5 text-sm font-medium text-henna">
            {EVENT.categories.map((c, i) => (
              <span key={c} className="whitespace-nowrap">
                {c}
                {i < EVENT.categories.length - 1 && <span className="ml-2 text-marigold">·</span>}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-col items-center gap-3">
            <span className="bg-peach px-6 py-2.5 font-serif text-xl font-bold text-maroon sm:text-2xl">
              {EVENT.dateLong}
            </span>
            <span className="font-serif text-xl font-semibold text-olive sm:text-2xl">{EVENT.hours}</span>
          </div>

          <p className="eyebrow mt-4 text-umber">
            {EVENT.venue}, {EVENT.city}
          </p>

          <p className="mx-auto mt-6 flex max-w-md items-center justify-center gap-2 border border-maroon/25 bg-paper/70 px-5 py-2.5 text-sm font-medium text-maroon">
            <Sparkle size={13} className="text-marigold" />
            {EVENT.extra}
          </p>

          <Rangoli size={78} className="mx-auto mt-7 opacity-90 sm:size-24" />
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto grid max-w-5xl gap-10 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[minmax(0,1fr)_26rem] lg:items-start lg:gap-x-16">
          <section className="lg:col-start-1 lg:row-start-1">
            <p className="eyebrow text-henna">{EVENT.invite}</p>
            <h2 className="mt-3 font-serif text-4xl font-bold leading-tight text-ink sm:text-5xl">
              Get your entry pass.
            </h2>
            <p className="mt-4 max-w-md leading-relaxed text-ink-soft">{EVENT.blurb}</p>
            <p className="mt-4 max-w-md leading-relaxed text-ink-soft">{EVENT.entryNote}</p>
            <p className="mt-5 max-w-md border-l-2 border-marigold pl-4 font-serif text-lg leading-snug text-henna">
              {EVENT.closer}
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
