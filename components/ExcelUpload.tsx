"use client";

import { useState, useRef, DragEvent } from "react";
import * as XLSX from "xlsx";

interface ParsedRow {
  name: string;
  email: string;
  number: string;
}

interface UploadResult {
  success: number;
  errors: { row: number; name: string; error: string }[];
}

const Code = ({ children }: { children: React.ReactNode }) => (
  <code className="bg-cream px-1 font-mono text-[0.7rem] text-ink-soft">{children}</code>
);

export default function ExcelUpload() {
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const parseFile = (file: File) => {
    setParseError(null);
    setResult(null);
    setRows([]);
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target!.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const raw = XLSX.utils.sheet_to_json<Record<string, string>>(sheet, { defval: "" });

        if (raw.length === 0) {
          setParseError("The spreadsheet appears to be empty.");
          return;
        }

        const parsed: ParsedRow[] = raw.map((r) => {
          const find = (key: string) =>
            Object.entries(r).find(([k]) => k.toLowerCase().trim() === key)?.[1]?.toString().trim() ?? "";
          return { name: find("name"), email: find("email"), number: find("number") };
        });

        const valid = parsed.filter((r) => r.name && r.email && r.number);
        if (valid.length === 0) {
          setParseError('No valid rows found. Ensure the sheet has "name", "email" and "number" columns with values.');
          return;
        }

        setRows(valid);
      } catch {
        setParseError("Could not parse the file. Make sure it is a valid .xlsx, .xls, or .csv file.");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) parseFile(file);
  };

  const handleSubmit = async () => {
    setUploading(true);
    const errors: UploadResult["errors"] = [];
    let success = 0;

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      try {
        const res = await fetch("/api/entries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(row),
        });
        if (res.ok) {
          success++;
        } else {
          const d = await res.json();
          errors.push({ row: i + 1, name: row.name, error: d.error || "Failed" });
        }
      } catch {
        errors.push({ row: i + 1, name: row.name, error: "Network error" });
      }
    }

    setResult({ success, errors });
    setRows([]);
    setFileName(null);
    setUploading(false);
  };

  const reset = () => {
    setRows([]);
    setFileName(null);
    setResult(null);
    setParseError(null);
  };

  if (result) {
    return (
      <div className="space-y-4">
        <div className={result.errors.length === 0 ? "alert-ok" : "alert-error"}>
          <p className="font-semibold">
            {result.success} registration{result.success === 1 ? "" : "s"} imported
            {result.errors.length > 0 && `, ${result.errors.length} failed`}
          </p>
          {result.errors.length > 0 && (
            <ul className="mt-2 space-y-1">
              {result.errors.map((e) => (
                <li key={e.row}>
                  Row {e.row} ({e.name}): {e.error}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button onClick={reset} className="btn-secondary">
          Upload another file
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`cursor-pointer border-2 border-dashed p-8 text-center transition ${
          dragging ? "border-navy bg-cream" : "border-rule bg-white hover:border-taupe"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) parseFile(f);
          }}
        />
        <p className="font-serif text-xl text-ink">{fileName ?? "Drop a spreadsheet here"}</p>
        <p className="mt-1 text-sm text-umber">or click to browse · .xlsx, .xls, .csv</p>
        <p className="mt-4 text-xs text-sand">
          Columns: <Code>name</Code>, <Code>email</Code>, <Code>number</Code>. Numbers without a country code are
          treated as +91.
        </p>
      </div>

      {parseError && <div className="alert-error">{parseError}</div>}

      {rows.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-ink-soft">{rows.length} rows ready to import</p>
            <button onClick={reset} className="text-sm text-umber hover:text-ink">
              Clear
            </button>
          </div>
          <div className="max-h-60 overflow-auto border border-rule bg-white">
            <table className="w-full text-sm">
              <thead className="sticky top-0 border-b border-rule bg-paper">
                <tr>
                  {["#", "Name", "Email", "Number"].map((h) => (
                    <th key={h} className="eyebrow px-3 py-2 text-left text-sand">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} className="border-b border-rule last:border-0">
                    <td className="px-3 py-2 text-sand">{i + 1}</td>
                    <td className="px-3 py-2 text-ink">{r.name}</td>
                    <td className="px-3 py-2 text-umber">{r.email}</td>
                    <td className="whitespace-nowrap px-3 py-2 text-umber">{r.number}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button onClick={handleSubmit} disabled={uploading} className="btn-primary">
            {uploading ? `Importing ${rows.length} registrations…` : `Import ${rows.length} registrations`}
          </button>
        </div>
      )}
    </div>
  );
}
