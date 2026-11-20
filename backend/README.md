# IHRC-USA – Content backend (Laravel + Filament)

This Laravel app is the admin panel for the React website in the parent folder.
Staff log in at **`/admin`** and edit content; the website reads it from the JSON API.

## What the admin can do

| Admin menu | Who (role) | What |
|---|---|---|
| Dashboard | everyone | New submissions, members, subscribers, latest submissions and activity |
| Inbox → Submissions | Viewer (read), Membership Officer (applications only), Super Admin | Every website form with its reference number. Filter by form, status, date; status New / In review / Approved / Rejected; notes; approve (Membership/Volunteer → creates a member) or reject; PDF and CSV |
| Members → Member register | Membership Officer | Member ID (IHRC-M-00001), status, joined/expiry, fee, private ID/CV files; CSV import and export |
| Members → Leadership & People | Membership Officer | People shown on the website's Members pages (page + seat) |
| News & Updates, Organisation | Editor | News, events (+ registrations per event, registration on/off), projects, publications (date, cover), branches, partners, donors & sponsors, award categories |
| Website pages → Pages | Editor | Page Builder: new pages, web address, rich text sections, images, embedded form, menu, publish/unpublish |
| Website pages → Form Builder | Super Admin | Build and edit forms (text, email, phone, date, long text, choices with "Other", files with type/size, statements to accept, tables, "show only if"). The Membership, Volunteer and Researchers forms are already in it. Published forms appear at `/forms/<address>` and can be placed on any page |
| Newsletter | Editor | Subscribers (double opt-in, export, unsubscribe) and sending newsletters |
| Administration | Super Admin | Settings (contact details, social links, payment link, **mailboxes**), admin users and roles, activity log |

Roles: **Super Admin** everything · **Editor** website content and newsletter · **Membership Officer** members and applications · **Viewer** read-only submissions and reports.
Each admin can turn on two-factor login (authenticator app) in their profile; "Forgot password?" sends a reset email; sessions expire after 60 minutes (`SESSION_LIFETIME`).

## How a website form is handled

1. Checked: required answers, email format, must-accept answers, file type and size per question (Form Builder forms); spam honeypot, link-spam and 10-per-minute limits.
2. Files are stored privately and scanned with ClamAV when `VIRUS_SCAN_COMMAND` is set (infected files are rejected).
3. Saved with a reference number `IHRC-YYYY-000123`, status New.
4. Emailed to the form's mailbox (Administration → Settings → "Mailbox – …"; empty mailboxes fall back to the Info mailbox, then the contact email). The website cannot choose the mailbox.
5. The applicant gets a confirmation email with the reference (when the form asks for an email address).
6. The website shows the reference number.

## API

- `GET /api/content` – everything the website shows (cached; cleared on every save)
- `GET /api/news|events|projects|publications` and `/{id}` – published items, newest first
- `GET /api/supporters` – donors & sponsors
- `POST /api/forms` – website forms
- `GET /api/verify/{memberId}` – public member check: name, title, country, status, photo only
- `POST /api/subscribe`, `GET /api/subscribe/confirm/{token}`, `GET /api/unsubscribe/{token}` – newsletter

## Local setup

```bash
cd backend
composer install
cp .env.example .env && php artisan key:generate
touch database/database.sqlite
php artisan migrate --seed
php artisan storage:link
./serve.sh                   # http://localhost:8000/admin (allows large form uploads)
```

The seeder creates the first admin from `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `.env`
(defaults: `admin@example.com` / `change-me-now`) as **Super Admin** — change the password from the profile menu
after the first login. Add more admins in Administration → Admin users.

Then in the website folder create `.env.local` with `VITE_API_URL=http://localhost:8000` and run `npm run dev`.

## Production

1. Host this folder on any PHP 8.3+ host (point the web root to `backend/public`).
   SQLite works for a small site; for MySQL set the `DB_*` variables.
2. `.env`: `APP_ENV=production`, `APP_DEBUG=false`, `APP_URL=https://admin.your-domain`,
   `FRONTEND_URL=https://www.your-domain`, `FRONTEND_URLS=https://your-domain,https://www.your-domain` (CORS),
   **`MAIL_*`** (SMTP or a mail provider – needed for mailbox emails, confirmations, password reset and newsletters),
   optional `VIRUS_SCAN_COMMAND="clamdscan --no-summary --fdpass"` when ClamAV is installed.
   The mailboxes are already set to membership@ihrc-usa.org, complaints@ihrc-usa.org, … (Administration → Settings) –
   create those mailboxes (or forwarders) at your host. Email is sent through your hosting SMTP mailbox: fill in
   `MAIL_PASSWORD` (and check host/port) using the block in `.env.example`, run `php artisan config:clear`, then
   `php artisan mail:test you@example.com` or use **Send test email** in Administration → Settings.
   Add the cron entry `* * * * * cd /path/to/backend && php artisan schedule:run` so queued newsletters are sent.
   PHP `memory_limit` 256M or more (the Form Builder edits large forms).
3. `composer install --no-dev -o && php artisan migrate --seed --force && php artisan storage:link && php artisan optimize`
4. Build the website with `VITE_API_URL=https://admin.your-domain npm run build` and deploy `dist/` as before.

## When the website structure changes

Member groups, program list, publication categories and the default page text come from the React code.
After changing them there, run `npm run export-structure` in the website folder to refresh
`database/data/site-structure.json`, then `php artisan db:seed` (adds new pages/settings, keeps edits).

## Tests

```bash
php artisan test
```

`tests/Feature/AdminContentTest.php` creates and edits every content type through the admin screens and checks
what `/api/content` returns; `tests/Feature/FormSubmissionTest.php` posts forms exactly like the website does
(including large uploads) and checks they appear in the admin inbox.
