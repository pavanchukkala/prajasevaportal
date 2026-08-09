# API Map

## Existing API Routes
- `GET /api/analytics/overview` - Fetch complaint statistics
- `POST /api/auth/login` - Authenticate staff (role-based)
- `POST /api/auth/logout` - Clear session
- `GET /api/complaints` - List complaints (masked, safe)
- `POST /api/complaints` - Submit new complaint with AI analysis
- `GET /api/complaints/[id]` - Public status lookup
- `PATCH /api/complaints/[id]/status` - Reviewer status update
- `GET /api/complaints/[id]/status` - Reviewer detailed case fetch
- `GET /api/health` - Health check (Returns 200 OK)
- `GET /api/track` - Token-based public tracking lookup
