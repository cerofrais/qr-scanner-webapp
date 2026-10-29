import type { Metadata } from "next";
import { Fraunces, Poppins } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { EVENT } from "@/utils/event";

// Measurement IDs aren't secret — they ship to the browser either way. The
// env var is only so a staging deploy can point somewhere else.
const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "G-06YMFSYZ2D";

const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"] });
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
    <html lang="en" className={`${fraunces.variable} ${poppins.variable} h-full antialiased`}>
      <body className="flex min-h-screen flex-col">
        {children}

        {/* Google Analytics — production only, so local runs and preview
            builds don't land in the live property. */}
        {process.env.NODE_ENV === "production" && GA_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="google-analytics" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
