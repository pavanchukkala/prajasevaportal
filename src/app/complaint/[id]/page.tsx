import { redirect } from "next/navigation";

// Old /complaint/[id] public route is now locked.
// Redirect unauthenticated users to login (middleware handles this,
// but this component is a fallback for any direct server render).
export default function OldComplaintRedirect() {
  redirect("/staff/login");
}
