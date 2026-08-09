# Route Map

## Existing Routes
- `/` (Home)
- `/about`
- `/constituency`
- `/constituency/mandals`
- `/constituency/services`
- `/contact`
- `/dashboard` (Redirects to `/mla/dashboard`)
- `/developer`
- `/learn`
- `/learn/departments`
- `/learn/evidence`
- `/learn/how-to-complain`
- `/learn/welfare`
- `/mla/complaint/[complaintId]`
- `/mla/dashboard`
- `/privacy`
- `/security`
- `/staff/login`
- `/submit`
- `/track`
- `/complaint/[id]` (Redirects to `/mla/complaint/[id]`)

## Missing Routes (Required for Full Flow)
- `/reviewer/cases`
- `/reviewer/case/[id]`
- `/department/workspace`
- `/admin/settings`

## Broken Routes
- None currently crash the build, but the old `/dashboard` and `/complaint/[id]` links might still exist in some legacy UI components (though middleware redirects them safely).
