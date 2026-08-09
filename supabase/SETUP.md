# Socks Co — Setup Guide

This project is ready to run. The only thing needed for the full experience
(admin dashboard, photo uploads, order storage) is a Supabase project.

## 1. Run the site (no database needed to preview)

```bash
npm install
npm run dev        # http://localhost:5173
```

Without Supabase keys the site still renders the full catalog from built-in
placeholder data so you can see the design immediately.

## 2. Create your Supabase project

1. Sign up / log in at https://supabase.com
2. **New project** → pick a name (e.g. `socks-co`) → choose region → create.
3. Open **Project Settings → API** and copy:
   - `Project URL`
   - `anon public` key
4. In the project, open **Project Settings → API → none** — keep them private.

## 3. Connect the app to Supabase

Copy `.env.example` to `.env` (already present) and fill in:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

## 4. Create the database

1. Open **SQL Editor → New query**.
2. Paste the contents of `supabase/schema.sql` and run.
3. In a **new** query, paste `supabase/seed.sql` and run.

This creates all tables, security rules, the auto-profile trigger, the
`products` storage bucket, and seeds 6 categories + 17 sample products.

## 5. Create the admin account

1. In Supabase go to **Authentication → Users → Add user**.
2. Add the owner's email + a temporary password.
3. Run this in the SQL Editor (replace the email):

```sql
update public.profiles
set role = 'admin'
where user_id = (select id from auth.users where email = 'OWNER@EXAMPLE.COM');
```

4. Tell the owner to log in at `http://localhost:5173/admin` and change their
   password from their Supabase account settings (or via "Forgot password" on
   the admin login).

## 6. Configure alerts (email + WhatsApp)

In the admin panel go to **Settings** and set:
- **Store info** → the owner's email, phone and WhatsApp number (international
  format, digits only, e.g. `94771234567`).
- **Order alerts** → the email that should receive order notifications
  (FormSubmit sends these; the first email triggers a one-time confirmation
  link — click it once and alerts flow from then on).

Order alerts:
- **WhatsApp** — a message is opened on WhatsApp to the owner's number with the
  full order summary (no API needed).
- **Email** — sent via FormSubmit (free) to the configured email.

## 7. Replace placeholder sock images

Every product currently uses a clean placeholder illustration. To use real photos:
1. In **Admin → Products → Add/Edit**, click **Upload Image** and pick your photos.
   They are stored in Supabase storage (`products` bucket) and served publicly.

## Notes

- Prices are shown per pair and per bundle of 12 pairs. The bundle price,
  bundle size and minimum order (MOQ) are editable per product.
- Customers can order **samples** from the "Order Samples" page — these are
  stored as sample orders and also sent to email + WhatsApp.
- There is **no payment gateway** — orders are placed on delivery info only.
