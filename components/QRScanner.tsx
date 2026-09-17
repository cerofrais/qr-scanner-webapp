"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { EVENT } from "@/utils/event";
import { formatPhone, type Entry } from "@/utils/entry";

type ScanState =
  | { status: "idle" }
  | { status: "scanning" }
  | { status: "checking" }
  | { status: "success"; entry: Entry }
  | { status: "already_scanned"; entry: Entry }
  | { status: "invalid"; scanned: string }
  | { status: "error"; id: string; message: string }
  | { status: "camera_error"; message: string };

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function scannedAt(entry: Entry): string | null {
  if (!entry.checked_in_at) return null;
  return new Date(entry.checked_in_at).toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  });
}

function GuestDetails({ entry }: { entry: Entry }) {
  const sub = "text-cream/80";
  return (
    <div className="mt-5 space-y-0.5">
      <p className="break-words font-serif text-3xl leading-tight">{entry.name}</p>
      <p className={`text-sm ${sub}`}>{formatPhone(entry.number)}</p>
      <p className={`break-all text-sm ${sub}`}>{entry.email}</p>
    </div>
  );
}

// Scanning a pass checks the guest in immediately. The API only flips
// checkedin false → true, so a second scan (from any device) comes back
// as "already scanned".
export default function QRScanner() {
  const scannerRef = useRef<InstanceType<typeof import("html5-qrcode").Html5Qrcode> | null>(null);
  const isProcessing = useRef(false);
  const [state, setState] = useState<ScanState>({ status: "idle" });

  const stopScanner = useCallback(async () => {
    const scanner = scannerRef.current;
    scannerRef.current = null;
    if (!scanner) return;
    try {
      if (scanner.isScanning) await scanner.stop();
      scanner.clear();
    } catch {
      // ignore stop errors
    }
  }, []);

  const checkIn = useCallback(async (id: string) => {
    setState({ status: "checking" });
    try {
      const res = await fetch(`/api/entries/${id}`, { method: "PATCH" });
      const body = await res.json();
      if (res.ok) {
        navigator.vibrate?.(120);
        setState({ status: "success", entry: body });
      } else if (res.status === 409 && body.entry) {
        navigator.vibrate?.([120, 80, 120, 80, 120]);
        setState({ status: "already_scanned", entry: body.entry });
      } else if (res.status === 404) {
        setState({ status: "invalid", scanned: id });
      } else {
        setState({ status: "error", id, message: body.error || "Check-in failed" });
      }
    } catch {
      setState({ status: "error", id, message: "Couldn't reach the server. Check the connection and retry." });
    }
  }, []);

  // Start the camera once the #qr-reader element is on screen; stop it
  // whenever we leave the scanning state.
  useEffect(() => {
    if (state.status !== "scanning") return;
    let cancelled = false;
    isProcessing.current = false;

    (async () => {
      const { Html5Qrcode } = await import("html5-qrcode");
      if (cancelled) return;
      const scanner = new Html5Qrcode("qr-reader");
      scannerRef.current = scanner;
      try {
        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 240, height: 240 } },
          (decodedText) => {
            if (isProcessing.current) return;
            isProcessing.current = true;
            const id = decodedText.trim();
            if (UUID_RE.test(id)) {
              checkIn(id);
            } else {
              setState({ status: "invalid", scanned: id });
            }
          },
          undefined
        );
        if (cancelled) stopScanner();
      } catch (err) {
        if (!cancelled) {
          setState({
            status: "camera_error",
            message: err instanceof Error ? err.message : String(err),
          });
        }
      }
    })();

    return () => {
      cancelled = true;
      stopScanner();
    };
  }, [state.status, checkIn, stopScanner]);

  const scanNext = () => setState({ status: "scanning" });

  return (
    <div className="space-y-4">
      {state.status === "idle" && (
        <div className="card px-6 py-12 text-center">
          <p className="font-serif text-2xl text-ink">Ready at the door?</p>
          <p className="mx-auto mt-2 max-w-xs text-sm text-umber">
            Point the camera at a guest&apos;s pass. They&apos;re checked in the moment it scans.
          </p>
          <button onClick={scanNext} className="btn-primary mx-auto mt-6 max-w-xs">
            Start scanning
          </button>
        </div>
      )}

      {state.status === "scanning" && (
        <div className="space-y-3">
          <div id="qr-reader" className="mx-auto w-full max-w-sm overflow-hidden border border-rule bg-navy" />
          <button onClick={() => setState({ status: "idle" })} className="btn-secondary">
            Stop camera
          </button>
        </div>
      )}

      {state.status === "checking" && (
        <div className="card space-y-3 py-14 text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-navy border-t-transparent" />
          <p className="text-umber">Checking pass…</p>
        </div>
      )}

      {state.status === "success" && (
        <div className="bg-forest px-6 py-8 text-cream" role="status">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-cream text-2xl text-forest">✓</span>
            <div>
              <p className="font-serif text-3xl leading-none">Success</p>
              <p className="eyebrow mt-1.5 text-cream/80">Checked in · {scannedAt(state.entry)}</p>
            </div>
          </div>
          <GuestDetails entry={state.entry} />
        </div>
      )}

      {state.status === "already_scanned" && (
        <div className="bg-brick px-6 py-8 text-cream" role="alert">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-cream text-2xl font-bold text-brick">!</span>
            <div>
              <p className="font-serif text-3xl leading-none">Already scanned</p>
              <p className="eyebrow mt-1.5 text-cream/80">
                {scannedAt(state.entry) ? `First scanned at ${scannedAt(state.entry)}` : "This pass has been used"}
              </p>
            </div>
          </div>
          <GuestDetails entry={state.entry} />
        </div>
      )}

      {state.status === "invalid" && (
        <div className="card border-l-4 border-l-brick px-6 py-7" role="alert">
          <p className="font-serif text-2xl text-brick">Not a valid pass</p>
          <p className="mt-1 text-sm text-umber">This QR code isn&apos;t a {EVENT.name} registration.</p>
          <p className="mt-3 break-all font-mono text-xs text-sand">{state.scanned}</p>
        </div>
      )}

      {state.status === "error" && (
        <div className="space-y-3">
          <div className="alert-error">{state.message}</div>
          <button onClick={() => checkIn(state.id)} className="btn-primary">
            Retry check-in
          </button>
        </div>
      )}

      {state.status === "camera_error" && (
        <div className="alert-error">
          Couldn&apos;t start the camera — allow camera access for this site and try again.
          <span className="mt-1 block text-xs opacity-80">{state.message}</span>
        </div>
      )}

      {["success", "already_scanned", "invalid", "error", "camera_error"].includes(state.status) && (
        <button onClick={scanNext} className="btn-primary">
          Scan next pass
        </button>
      )}
    </div>
  );
}
