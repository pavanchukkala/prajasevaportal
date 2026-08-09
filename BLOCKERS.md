# Blockers

The following items are missing and prevent the complete end-to-end flow from being tested as requested:

1. **Missing Reviewer/Admin Routes**: The flow specifies that a reviewer uses `/reviewer/cases` and `/reviewer/case/[id]`, and an admin uses `/admin/settings`. These routes do not exist yet. The current implementation uses `/mla/dashboard` and `/mla/complaint/[id]` for the primary staff view.
2. **Missing Department Routes**: The flow specifies `/department/workspace`, which does not exist.
3. **Database/Storage Persistence**: The application currently uses an in-memory database (`src/lib/db.ts`). This works for a single session but data is lost on server restart, making end-to-end persistent testing (e.g., across deployments or restarts) impossible without a real database (Supabase/PostgreSQL).
4. **Notification Provider Implementation**: The system logs notifications internally but does not actually integrate with SMS/WhatsApp providers, meaning the "notification queued" fallback must be strictly enforced.
5. **Testing Framework**: No automated API or browser tests currently exist in the repository to verify the complete flow.
