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
    "100 curated stalls and live makers. Festive wardrobe. Handloom zone with revival sarees at weaver prices. Jewelry. Kids' zone and workshops. Cultural experiences through the day.",
  // Each sits on its own line under the blurb.
  highlights: [
    "Live band ft. Krithi Vangala in an A.R. Rahman tribute.",
    "Kids dandiya workshop by Varsha and Meenakshi",
    "Garba Workshop by Nicy Joseph",
  ],
  email: "hello@latecheckoutclub.in",
  phone: "83634 92358",
} as const;

