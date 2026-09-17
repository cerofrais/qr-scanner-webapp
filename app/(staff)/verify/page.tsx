"use client";

import dynamic from "next/dynamic";
import PageHeader from "@/components/PageHeader";

const QRScanner = dynamic(() => import("@/components/QRScanner"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center py-16">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-navy border-t-transparent" />
    </div>
  ),
});

export default function VerifyPage() {
  return (
    <>
      <PageHeader eyebrow="At the door" title="Scan passes">
        Each pass works once. You&apos;ll see Success, or Already scanned if it&apos;s been used.
      </PageHeader>
      <QRScanner />
    </>
  );
}
