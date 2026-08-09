# Current State

## Framework
- **Next.js**: 16.3.0
- **React**: 19.2.8
- **Styling**: Tailwind CSS v4, Vanilla CSS

## Database / Storage
- **Current**: In-memory database (`src/lib/db.ts`) using a global variable for persistence across hot-reloads.
- **Limitation**: Data is lost on server restart.

## Authentication
- **Implementation**: Custom cookie-based session (`psip_session`).
- **Storage**: Credentials loaded from environment variables (`PSIP_ADMIN_USER`, etc.). Dev fallbacks exist but are only printed to the server console, never exposed to the client.
- **Roles**: Supported roles include `administrator`, `mla_staff`, `reviewer`, `department_officer`.

## Language Implementation
- **Current**: English and Telugu available on specific pages (Submit, Track, Staff Login).
- **Persistence**: Saved via `localStorage` (`psip_lang`).

## Existing Assets
- **Political Images**: Currently using placeholder/mockup assets. Real optimized assets need to be placed in `public/assets`.
- **Developer Popup**: Implemented (`src/components/DeveloperPopup.tsx`) as a floating pill on public pages, hidden on protected routes.

## Existing Complaint Flow
- **Submission**: 5-step form at `/submit`.
- **Features**: Includes mobile number capture and explicit consent checkbox.
- **AI Integration**: AI analysis runs on submission (Gemini with local rule-based fallback).
- **Output**: Generates Tracking ID (`SKT-YYYY-NNNNN`) and private Tracking Token (`TKN-XXXXX-XXXXXX`).

## Dashboard Protection
- **Middleware**: `src/middleware.ts` protects `/mla`, `/staff`, `/reviewer`, `/department`, and `/admin`.
- **Redirects**: Unauthenticated users are sent to `/staff/login`.
