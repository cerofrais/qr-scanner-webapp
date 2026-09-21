# moodboard · Late Checkout — Entry System

Registration and door check-in for **moodboard**, a festive-season cultural pop-up by Late Checkout — Sunday, 27 September 2026, 11 am to 9 pm at SAS I Towers, Hyderabad.

Guests register at `/register` with their name, email and phone number and get a personal QR pass, with a welcome note and a *see you on 27 September at SAS I Towers*. Staff scan passes at the door: each pass checks in exactly once, and any later scan shows **Already scanned** with the time it was first used.

Every page except `/register` requires staff login.

---

## Pages

| Route | Who | What |
| --- | --- | --- |
| `/register` | Public | Event cover, registration form, welcome note + pass after submit |
| `/login` | Staff | Passcode login (`ADMIN_SECRET`) |
| `/verify` | Staff | Camera scanner — scan = check in. Shows **Success** or **Already scanned** |
| `/onboard` | Staff | Register a walk-in, or bulk-import a spreadsheet |
| `/admin` | Staff | Search by name / email / phone; edit, reprint or delete a registration |
| `/guests` | Staff | Every registration, newest first, 20 per page, with **Download CSV** |

### Registration
Name, email and phone number are all required. The phone field defaults to the **+91** country code; numbers are stored in E.164 (`+919876543210`), so `98765 43210`, `+91 98765-43210` and `919876543210` are recognised as the same number. Phone numbers are unique — one pass per number.

### The pass
Shows the QR code (the registration's UUID), name, phone, date and venue in the moodboard cover style. **Save pass** renders a 1080×1560 PNG (share sheet on phones, download on desktop); **Print** opens it for printing.

### Door check-in
Scanning a pass immediately marks it checked in and records `checked_in_at`. The update only matches rows where `checkedin = false`, so two devices scanning the same pass at once can't both succeed — the second sees **Already scanned**.

### Guest list & CSV export
`/guests` lists every registration with running totals (registered / checked in). **Download CSV** calls `GET /api/entries/export`, which returns all rows in registration order — name, email, phone, check-in status and time, registration time (IST), pass ID. Names and emails starting with `= + - @` are prefixed with `'` so spreadsheets can't run guest-supplied text as formulas.

### Bulk upload
`.xlsx`, `.xls` or `.csv` with columns `name`, `email`, `number` (see `public/sample_upload.csv`). Rows are submitted one by one; failures (e.g. duplicate numbers) are listed.

---

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: Supabase (PostgreSQL)
- **QR**: `qrcode.react` (on screen), `qrcode` (saved pass image), `html5-qrcode` (scanning)
- **Bulk upload parsing**: `xlsx`
- **Styling**: Tailwind CSS v4 — palette, Lora + Poppins, grid cover and four-square mark taken from the moodboard sponsor deck
- **Deployment**: Vercel

---

## Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
SUPABASE_SECRET_KEY=your_supabase_secret_key
ADMIN_SECRET=your_strong_passcode
```

`SUPABASE_SECRET_KEY` is server-only — never give it a `NEXT_PUBLIC_` prefix. The `entries` table has no RLS policies, so the publishable key can't read or write it; every query goes through the route handlers in `app/api`, which use the secret key. The browser is never given a Supabase key at all.

The scripts in `scripts/` read `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SECRET_KEY` from the environment too.

---

## Database

`public.entries`:

| Column | Type | Notes |
| --- | --- | --- |
| `id` | uuid | Encoded in the QR code |
| `name` | text, not null | |
| `email` | text, not null | |
| `number` | text, not null, **unique** | E.164, e.g. `+919876543210` |
| `checkedin` | boolean | |
| `checked_in_at` | timestamptz | Set on first scan |
| `created_at` | timestamptz | |

`public.entries_archive` holds registrations from past events as jsonb snapshots (`event`, `data`).

Both tables have RLS enabled with **no policies**. That makes them unreachable with the publishable key (which ships to browsers) and readable only via the secret key or the Supabase dashboard. Guest names, emails and phone numbers are only ever served through the staff-gated API.

Apply migrations with the Supabase CLI:

```bash
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

For a brand-new project you can instead paste `scripts/setup_entries.sql` into the SQL editor.

### Starting a new event
`supabase/migrations/20260917223000_moodboard_clean_slate.sql` shows the pattern: copy `entries` into `entries_archive` under an event label, delete the archived rows, then reshape. Update `utils/event.ts` for the new event's copy.

---

## Running Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll land on `/register`. Staff pages redirect to `/login`.

```bash
npm run test:entries    # insert → check in → second scan rejected → cleanup
npm run export:entries  # all registrations → entries.csv
```

Both scripts read `NEXT_PUBLIC_SUPABASE_URL` / `SUPABASE_SECRET_KEY` from the environment (e.g. `scripts/.env`).

---

## Deploying to Vercel

1. Push the repo to GitHub
2. Import the project at [vercel.com/new](https://vercel.com/new)
3. Add the environment variables above in Vercel → Settings → Environment Variables
4. Deploy

The GitHub Actions workflow in `.github/workflows/supabase-migrations.yml` can auto-apply migrations on push — it is currently disabled. To enable, remove the `if: ${{ false }}` line and add these repo secrets: `SUPABASE_ACCESS_TOKEN`, `SUPABASE_DB_PASSWORD`, `SUPABASE_PROJECT_REF`.

---

## Project Structure

```
app/
  layout.tsx            # Root: Lora + Poppins, metadata
  page.tsx              # Redirects / → /register
  register/page.tsx     # Public: cover, registration form
  login/page.tsx        # Staff passcode
  (staff)/              # Route group — shared staff header, no URL segment
    layout.tsx
    verify/page.tsx     # Door scanner
    onboard/page.tsx    # Walk-in + bulk upload
    admin/page.tsx      # Search / edit / delete
    guests/page.tsx     # Paginated guest list + CSV download
  api/
    auth/route.ts       # POST login / DELETE logout
    entries/
      route.ts          # POST create (public) / GET search (staff)
      export/route.ts   # GET all registrations as CSV (staff)
      [id]/route.ts     # GET / PATCH (scan-to-check-in or edit) / DELETE

components/
  EntryForm.tsx         # Name / email / +91 phone form (guest + staff variants)
  WelcomeNote.tsx       # Post-registration welcome
  EventPass.tsx         # QR pass on screen + Save/Print image
  QRScanner.tsx         # Scan → Success / Already scanned / Not a valid pass
  AdminSearch.tsx       # Search results + edit panel
  ExcelUpload.tsx       # Bulk import
  StaffHeader.tsx       # Staff nav (Scan · Register · Search · Guests)
  PageHeader.tsx, Mosaic.tsx, LogoutButton.tsx

utils/
  event.ts              # Event copy: name, date, venue
  entry.ts              # Entry type, validation, phone normalisation
  supabase/server.ts    # Server-only client (secret key, bypasses RLS)

proxy.ts                # Staff-gates everything except /register, /login, /api/auth, POST /api/entries
supabase/migrations/    # SQL migrations
scripts/                # setup_entries.sql, test-entries.mjs, export-entries-csv.mjs
```
