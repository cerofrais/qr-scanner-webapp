// Everything guest-facing about the current event lives here, so the next
// edition is a one-file change.
export const EVENT = {
  name: "moodboard",
  presenter: "Late Checkout",
  edition: "Festive season 2026 · Edition 1",
  tagline: "A festive-season cultural pop-up by Late Checkout.",
  dateLong: "Sunday, 27 September 2026",
  dateShort: "Sunday, 27 September",
  hours: "11 am to 9 pm",
  venue: "SAS I Towers",
  city: "Hyderabad",
  blurb:
    "110 curated stalls across two lobbies, live makers, workshops, food and a band on the outdoor stage after dark.",
  email: "hello@latecheckoutclub.in",
  phone: "83634 92358",
} as const;

// The nine zones from the moodboard deck, each with its accent colour.
export const MOODS = [
  { name: "Live artist zone", note: "Flautist, bangle maker, mithai and putharekulu, made in front of you", color: "var(--color-brick)" },
  { name: "Weaves & handlooms", note: "With the Dept of Handlooms, Telangana and ALEAP India", color: "var(--color-gold)" },
  { name: "Menswear & Indo-western", note: "The half of the wardrobe most pop-ups forget", color: "var(--color-magenta)" },
  { name: "Kids", note: "Shopping stalls plus a full day of planned activities", color: "var(--color-saffron)" },
  { name: "Food", note: "A dedicated food area, indoors and out", color: "var(--color-terracotta)" },
  { name: "Live music", note: "On the outdoor stage, from evening", color: "var(--color-royal)" },
  { name: "Dance workshops", note: "Movement sessions running through the day", color: "var(--color-forest)" },
  { name: "Discovery zone", note: "Self-taught talent and standout work from NIFT and Hamstech", color: "var(--color-taupe)" },
  { name: "Sponsor zone", note: "Sampling, demos and test drives from partner brands", color: "var(--color-navy)" },
] as const;
