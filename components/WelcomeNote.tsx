import { EVENT } from "@/utils/event";
import { firstName } from "@/utils/entry";

export default function WelcomeNote({ name }: { name: string }) {
  const first = firstName(name);

  return (
    <div className="card border-t-4 border-t-gold px-6 py-7 sm:px-8">
      <p className="eyebrow text-brick">You&apos;re on the list</p>
      <h2 className="mt-3 font-serif text-3xl leading-tight text-ink sm:text-4xl">
        Welcome to {EVENT.name}{first ? `, ${first}` : ""}.
      </h2>
      <p className="mt-4 leading-relaxed text-umber">
        We&apos;re so glad you&apos;re coming. Save the pass below and show it at the entrance —
        one scan and you&apos;re in.
      </p>

      <div className="mt-6 border-t border-rule pt-5">
        <p className="font-serif text-2xl leading-snug text-ink">
          See you on <span className="whitespace-nowrap">{EVENT.dateShort}</span> at{" "}
          <span className="whitespace-nowrap">{EVENT.venue}</span>.
        </p>
        <p className="mt-1 text-sm text-umber">
          {EVENT.hours} · {EVENT.city}
        </p>
      </div>
    </div>
  );
}
