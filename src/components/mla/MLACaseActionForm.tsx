"use client";

import { useState } from "react";

const actionStatuses = [
  { value: "Viewed", label: "Acknowledged by office / కార్యాలయం పరిశీలించింది" },
  { value: "Under Review", label: "Under verification / ధృవీకరణలో ఉంది" },
  { value: "More Information Requested", label: "Additional evidence requested / మరిన్ని ఆధారాలు అవసరం" },
  { value: "Assigned", label: "Assigned for field response / ఫీల్డ్ స్పందనకు కేటాయించబడింది" },
  { value: "Action Reported", label: "Field action reported / ఫీల్డ్ చర్య నివేదించబడింది" },
  { value: "Escalated", label: "Escalated for urgent intervention / అత్యవసర జోక్యానికి ఎస్కలేట్" },
  { value: "Resolved", label: "Resolved after verification / ధృవీకరణ తర్వాత పరిష్కరించబడింది" },
  { value: "Reopened", label: "Reopened for follow-up / తదుపరి చర్యకు తిరిగి తెరవబడింది" },
];

export default function MLACaseActionForm({ id }: { id: string }) {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage("");
    const form = new FormData(event.currentTarget);
    const response = await fetch(`/api/mla/cases/${id}/action`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify(Object.fromEntries(form)),
    });
    setPending(false);
    if (response.ok) {
      setMessage("Action recorded and visible in citizen tracking. / చర్య నమోదు అయింది.");
      location.reload();
      return;
    }
    const data = await response.json().catch(() => ({}));
    setMessage(data.error || "Unable to record action.");
  }

  return (
    <form onSubmit={submit} style={{ display: "grid", gap: 10 }}>
      <label>
        Civic action status / పౌర చర్య స్థితి
        <select name="status" defaultValue="Under Review" style={{ display: "block", width: "100%", padding: 10, marginTop: 4 }}>
          {actionStatuses.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}
        </select>
      </label>
      <label>
        Department routing / శాఖ కేటాయింపు
        <input name="assignedDepartment" placeholder="revenue, municipal, police..." style={{ display: "block", width: "100%", padding: 10, marginTop: 4 }} />
      </label>
      <label>
        Public-safe action note / ప్రజలకు చూపగల గమనిక
        <textarea name="internalNote" placeholder="Record verified action, evidence request, field response, or resolution note." required style={{ display: "block", width: "100%", minHeight: 90, padding: 10, marginTop: 4 }} />
      </label>
      <button type="submit" disabled={pending} style={{ padding: 12, borderRadius: 10, border: "none", background: "var(--accent-gold)", color: "#0f172a", fontWeight: 900, cursor: pending ? "wait" : "pointer" }}>
        {pending ? "Recording..." : "Record Action / చర్య నమోదు చేయండి"}
      </button>
      {message && <div style={{ color: "var(--text-muted)", fontSize: 13 }}>{message}</div>}
    </form>
  );
}
