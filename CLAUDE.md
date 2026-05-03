# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # start dev server (uses Turbopack)
npm run build    # production build — always run before committing
npm run lint     # ESLint
```

There are no tests. `npm run build` is the primary correctness check.

## Environment Variables

All seven `NEXT_PUBLIC_FIREBASE_*` vars must be present (see `lib/firebase.ts`). In production they are set in the Vercel dashboard; locally create `.env.local`:

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
```

## Architecture

### Two independent route trees

| Tree | Path | Auth | i18n |
|------|------|------|------|
| Public site | `app/[locale]/` | — | next-intl (en / th) |
| Admin panel | `app/admin/` | Firebase Auth | `lib/adminT.ts` (en / th) |

`app/page.tsx` and `app/layout.tsx` are root-level redirects/shells only; all real pages live under the two trees above.

### Internationalisation (public site)

Locales: `en` (default) and `th`, configured in `i18n/routing.ts`. next-intl v4 middleware handles locale detection and prefixing. Translation files are `messages/en.json` and `messages/th.json`, organised by namespace (`common`, `home`, `menu`, `gallery`, `campaigns`, `contact`, `footer`, `navbar`).

- **Server components** — `getTranslations("namespace")` from `next-intl/server`
- **Client components** — `useTranslations("namespace")` + `useLocale()` hooks
- Always use `useLocale()` (not `document.documentElement.lang`) for reactive locale detection in client components
- Shared brand names live in `common.brandName` / `common.brandNameFull` so they translate consistently

### Admin i18n

The admin panel does **not** use next-intl. It has its own translation map in `lib/adminT.ts` (`AdminLang = "en" | "th"`). The `AdminLangContext` provides `{ lang, setLang, t }` to all admin components; language preference is persisted to `localStorage`. To add a new translation key, add it to both `en` and `th` objects in `adminT.ts` — TypeScript will then enforce usage via `TranslationKey`.

### Firebase

`lib/firebase.ts` exports `auth`, `db`, `storage`. All Firestore logic is centralised in `lib/firestore.ts`:

- **Collections**: `menu`, `campaigns`, `gallery`
- **Single document**: `settings/contact` — contact info is one document, updated with `setDoc` (full overwrite)
- `DEFAULT_CONTACT` is the fallback when the document doesn't exist yet
- Image uploads go through `lib/storage.ts` to Firebase Storage

### Admin auth

`context/AuthContext.tsx` wraps Firebase Auth. `app/admin/layout.tsx` redirects unauthenticated users to `/admin/login`. The admin layout also wraps everything in `AdminLangProvider` then `AuthProvider`.

### Adding content to a new page

1. Add translation keys to both `messages/en.json` and `messages/th.json` under a new or existing namespace
2. Create `app/[locale]/<page>/page.tsx` — use `"use client"` if it fetches from Firestore on mount
3. Add a Firestore function to `lib/firestore.ts` if new data is needed
4. Add the admin CRUD page at `app/admin/<page>/page.tsx`, using `useAdminLang()` for translations
5. Add a nav link in `app/admin/layout.tsx` `navLinks` array
