import { redirect } from "next/navigation";

// Old /dashboard route now redirects to staff login → then to /mla/dashboard
// This prevents public access to the old unprotected dashboard
export default function OldDashboardRedirect() {
  redirect("/staff/login");
}
