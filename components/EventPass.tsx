"use client";

import { QRCodeSVG } from "qrcode.react";
import QRCode from "qrcode";
import { useState } from "react";
import Mosaic from "./Mosaic";
import { EVENT } from "@/utils/event";
import { formatPhone, type Entry } from "@/utils/entry";

type PassEntry = Pick<Entry, "id" | "name" | "number">;

const C = {
  navy: "#16263F",
  grid: "#1E3252",
  rule: "#31445F",
  cream: "#F4EADA",
  paper: "#FBF5EC",
  gold: "#C08A2E",
  mist: "#C9BCA9",
  haze: "#7E8CA3",
  squares: ["#E5006D", "#C08A2E", "#CF6A34", "#E3AC3D"],
};

function fitText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string {
  if (ctx.measureText(text).width <= maxWidth) return text;
  let out = text;
  while (out.length > 1 && ctx.measureText(`${out}…`).width > maxWidth) out = out.slice(0, -1);
  return `${out.trimEnd()}…`;
}

// Draws the pass as a 1080×1560 PNG in the deck's cover style, so guests
// can keep it in their camera roll.
async function renderPass(entry: PassEntry): Promise<HTMLCanvasElement> {
  const css = getComputedStyle(document.documentElement);
  const serif = css.getPropertyValue("--font-lora").trim() || "Georgia, serif";
  const sans = css.getPropertyValue("--font-poppins").trim() || "system-ui, sans-serif";
  await Promise.all([
    document.fonts.load(`400 40px ${serif}`),
    document.fonts.load(`400 40px ${sans}`),
    document.fonts.load(`700 40px ${sans}`),
  ]).catch(() => undefined);

  const W = 1080;
  const H = 1560;
  const PAD = 90;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  const track = (px: number) => {
    if ("letterSpacing" in ctx) ctx.letterSpacing = `${px}px`;
  };

  ctx.fillStyle = C.navy;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = C.grid;
  for (let x = 0; x < W; x += 52) ctx.fillRect(x, 0, 2, H);
  for (let y = 0; y < H; y += 52) ctx.fillRect(0, y, W, 2);

  // Mosaic mark, top right
  const sq = 46;
  C.squares.forEach((color, i) => {
    ctx.fillStyle = color;
    ctx.fillRect(W - PAD - sq * 2 - 8 + (i % 2) * (sq + 8), PAD + Math.floor(i / 2) * (sq + 8), sq, sq);
  });

  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = C.gold;
  ctx.font = `700 24px ${sans}`;
  track(6);
  ctx.fillText("ENTRY PASS · EDITION 1", PAD, PAD + 22);
  track(0);

  ctx.fillStyle = C.cream;
  ctx.font = `400 150px ${serif}`;
  ctx.fillText(EVENT.name, PAD - 6, PAD + 250);

  ctx.fillStyle = C.gold;
  ctx.font = `400 38px ${serif}`;
  ctx.fillText(EVENT.tagline, PAD, PAD + 320);

  // QR on a paper panel
  const panelY = 470;
  const panelH = 640;
  ctx.fillStyle = C.paper;
  ctx.fillRect(PAD, panelY, W - PAD * 2, panelH);
  const qr = document.createElement("canvas");
  await QRCode.toCanvas(qr, entry.id, {
    width: 560,
    margin: 0,
    errorCorrectionLevel: "H",
    color: { dark: C.navy, light: C.paper },
  });
  ctx.drawImage(qr, (W - 560) / 2, panelY + (panelH - 560) / 2, 560, 560);

  ctx.fillStyle = C.cream;
  let nameSize = 68;
  ctx.font = `400 ${nameSize}px ${serif}`;
  while (nameSize > 44 && ctx.measureText(entry.name).width > W - PAD * 2) {
    nameSize -= 4;
    ctx.font = `400 ${nameSize}px ${serif}`;
  }
  ctx.fillText(fitText(ctx, entry.name, W - PAD * 2), PAD, panelY + panelH + 105);

  ctx.fillStyle = C.gold;
  ctx.font = `700 26px ${sans}`;
  track(5);
  ctx.fillText(formatPhone(entry.number), PAD, panelY + panelH + 160);
  track(0);

  ctx.fillStyle = C.rule;
  ctx.fillRect(PAD, panelY + panelH + 200, W - PAD * 2, 2);

  ctx.fillStyle = C.cream;
  ctx.font = `400 42px ${serif}`;
  ctx.fillText(`${EVENT.dateShort} · ${EVENT.hours}`, PAD, panelY + panelH + 270);
  ctx.fillStyle = C.mist;
  ctx.font = `400 30px ${sans}`;
  ctx.fillText(`${EVENT.venue}, ${EVENT.city}`, PAD, panelY + panelH + 320);

  ctx.fillStyle = C.haze;
  ctx.font = `700 20px ${sans}`;
  track(5);
  ctx.fillText(`${EVENT.presenter.toUpperCase()} · ${EVENT.email.toUpperCase()}`, PAD, H - 70);

  return canvas;
}

export default function EventPass({ entry }: { entry: PassEntry }) {
  const [busy, setBusy] = useState<"save" | "print" | null>(null);
  const fileName = `${EVENT.name}-pass-${entry.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.png`;

  const handleSave = async () => {
    setBusy("save");
    try {
      const canvas = await renderPass(entry);
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
      if (!blob) return;

      // On phones, the share sheet is the way to "Save to Photos".
      const file = new File([blob], fileName, { type: "image/png" });
      if (window.matchMedia("(pointer: coarse)").matches && navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title: `${EVENT.name} pass` });
          return;
        } catch (err) {
          if (err instanceof Error && err.name === "AbortError") return;
          // Share not allowed here — fall through to a plain download.
        }
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    } finally {
      setBusy(null);
    }
  };

  const handlePrint = async () => {
    // Open synchronously so popup blockers see the click.
    const win = window.open("", "_blank");
    if (!win) return;
    setBusy("print");
    try {
      const canvas = await renderPass(entry);
      win.document.write(
        `<html><head><title>${EVENT.name} pass</title><style>@page{margin:12mm}body{margin:0;text-align:center}img{max-width:100%;max-height:96vh}</style></head>` +
          `<body><img src="${canvas.toDataURL("image/png")}" onload="window.focus();window.print()" /></body></html>`
      );
      win.document.close();
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="space-y-3">
      <div className="bg-grid relative overflow-hidden px-6 pb-6 pt-5 text-cream sm:px-8 sm:pb-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow text-gold">Entry pass</p>
            <p className="mt-1 font-serif text-4xl leading-none">{EVENT.name}</p>
          </div>
          <Mosaic size={14} gap={3} className="mt-1" />
        </div>

        <div className="mx-auto mt-6 w-fit bg-paper p-4">
          <QRCodeSVG
            value={entry.id}
            size={208}
            level="H"
            bgColor={C.paper}
            fgColor={C.navy}
            title={`Entry QR code for ${entry.name}`}
          />
        </div>

        <p className="mt-6 break-words font-serif text-2xl leading-tight">{entry.name}</p>
        <p className="eyebrow mt-2 text-gold">
          {formatPhone(entry.number)}
        </p>

        <div className="mt-5 border-t border-navy-rule pt-4">
          <p className="font-serif text-lg">
            {EVENT.dateShort} · <span className="whitespace-nowrap">{EVENT.hours}</span>
          </p>
          <p className="mt-0.5 text-sm text-mist">
            {EVENT.venue}, {EVENT.city}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button type="button" onClick={handleSave} disabled={busy !== null} className="btn-primary">
          {busy === "save" ? "Preparing…" : "Save pass"}
        </button>
        <button type="button" onClick={handlePrint} disabled={busy !== null} className="btn-secondary">
          {busy === "print" ? "Preparing…" : "Print"}
        </button>
      </div>
    </div>
  );
}
