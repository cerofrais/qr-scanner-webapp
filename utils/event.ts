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
  invite: "You're on our special guest list.",
  blurb:
    "The cutest Diwali shopping experience in town — hidden gems, gifting finds, fashion, jewellery, accessories, festive décor and all things pretty. Plus food, games, workshops and sunset music.",
  // Called out on its own, after the date.
  extra: "Stay back for a special Halloween Sundowner at AKAN Rooftop.",
  entryNote: "Share your details, get your QR pass, and show it at the door for free entry.",
  closer: "Come with your favourite people, shop a little, sip a little, and make a lovely Sunday out of it.",
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
