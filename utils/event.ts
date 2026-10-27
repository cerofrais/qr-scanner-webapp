// Everything guest-facing about the current event lives here, so the next
// edition is a one-file change.
export const EVENT = {
  name: "Diwali Socials",
  nameLead: "Diwali", // the display type splits across two lines
  nameTail: "Socials",
  kicker: "Pop up",
  presenter: "Late Checkout",
  edition: "Diwali 2026",
  tagline: "A Diwali pop-up by Late Checkout.",
  dateLong: "Sunday, 1 November 2026",
  dateShort: "Sunday, 1 November",
  hours: "11 am to 8 pm",
  venue: "AKAN",
  city: "Hyderabad",
  blurb: "A festive afternoon into evening of shopping, food and music.",
  // The line-up from the flyer.
  categories: [
    "Fashion",
    "Jewelry",
    "Hidden finds",
    "Accessories",
    "Decor",
    "Games",
    "Sunset music",
    "Food",
    "Craft",
    "Beverage",
    "Beer and alcohol",
  ],
  email: "hello@latecheckoutclub.in",
  phone: "83634 92358",
} as const;
