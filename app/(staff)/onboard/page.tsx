"use client";

import { useState } from "react";
import EntryForm from "@/components/EntryForm";
import ExcelUpload from "@/components/ExcelUpload";
import PageHeader from "@/components/PageHeader";

type Tab = "individual" | "bulk";

export default function OnboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>("individual");

  return (
    <>
      <PageHeader eyebrow="Guest list" title="Register guests">
        Add a walk-in, or import a spreadsheet of registrations.
      </PageHeader>

      <div className="mb-5 flex border-b border-rule">
        {(["individual", "bulk"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-medium transition ${
              activeTab === tab ? "border-navy text-ink" : "border-transparent text-umber hover:text-ink"
            }`}
          >
            {tab === "individual" ? "One guest" : "Bulk upload"}
          </button>
        ))}
      </div>

      <div className="card p-5 sm:p-6">{activeTab === "individual" ? <EntryForm /> : <ExcelUpload />}</div>
    </>
  );
}
