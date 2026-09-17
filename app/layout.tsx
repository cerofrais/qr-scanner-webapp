import type { Metadata } from "next";
import { Lora, Poppins } from "next/font/google";
import "./globals.css";
import { EVENT } from "@/utils/event";

const lora = Lora({ variable: "--font-lora", subsets: ["latin"] });
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: `${EVENT.name} · ${EVENT.presenter}`,
  description: `${EVENT.tagline} ${EVENT.dateLong}, ${EVENT.hours} at ${EVENT.venue}, ${EVENT.city}.`,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${lora.variable} ${poppins.variable} h-full antialiased`}>
      <body className="flex min-h-screen flex-col">{children}</body>
    </html>
  );
}
