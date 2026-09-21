"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "./LogoutButton";
import Mosaic from "./Mosaic";
import { EVENT } from "@/utils/event";

const LINKS = [
  { href: "/verify", label: "Scan" },
  { href: "/onboard", label: "Register" },
  { href: "/admin", label: "Search" },
  { href: "/guests", label: "Guests" },
];

export default function StaffHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-10">
      <div className="bg-grid text-cream">
        <div className="mx-auto flex h-14 max-w-xl items-center justify-between gap-3 px-4">
          <Link href="/verify" className="flex items-center gap-2.5">
            <Mosaic size={9} gap={2} />
            <span className="font-serif text-xl leading-none">{EVENT.name}</span>
            <span className="eyebrow text-gold">Staff</span>
          </Link>
          <LogoutButton />
        </div>
      </div>
      <nav className="border-b border-rule bg-paper">
        <div className="mx-auto flex max-w-xl px-4">
          {LINKS.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`-mb-px flex-1 border-b-2 py-3 text-center text-sm font-medium transition ${
                  active ? "border-gold text-ink" : "border-transparent text-umber hover:text-ink"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
