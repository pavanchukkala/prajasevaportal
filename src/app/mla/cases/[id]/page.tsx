import Link from "next/link";
import { db } from "@/lib/db";
import {
  actionType,
  department,
  evidenceCount,
  getMLAData,
  isSafety,
  maskContact,
  priority,
  requireMLASession,
  titleOf,
} from "@/lib/mla";
import { Empty, MLAWorkspace, Panel } from "@/components/mla/MLAWorkspace";
import MLACaseActionForm from "@/components/mla/MLACaseActionForm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function evidenceKind(url: string) {
  const clean = url.split("?")[0].toLowerCase();
  if (/\.(mp4|webm|mov|3gp|avi|mkv)$/.test(clean)) return "video";
  if (/\.(mp3|wav|ogg|m4a)$/.test(clean)) return "audio";
  if (/\.(jpg|jpeg|png|webp|gif)$/.test(clean)) return "image";
  return "file";
}

function EvidencePreview({ url, index }: { url: string; index: number }) {
  const kind = evidenceKind(url);
  const label = `Evidence ${index + 1}`;

  if (kind === "video") {
    return <video controls preload="metadata" src={url} style={{ width: "100%", maxWidth: 520, borderRadius: 12 }} />;
  }

  if (kind === "audio") {
    return <audio controls src={url} style={{ width: "100%", maxWidth: 520 }} />;
  }

  if (kind === "image") {
    return <img src={url} alt={label} style={{ width: "100%", maxWidth: 420, borderRadius: 12 }} />;
  }

  return <Link href={url}>{label}</Link>;
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireMLASession();
  const { id } = await params;
  const data = await getMLAData().catch(() => null);
  const buildId = data?.system.buildId || "unknown";
  const commitSha = data?.system.commitSha || "unknown";
  const refreshedAt = data?.refreshedAt || new Date().toISOString();

  if (!/^[-A-Za-z0-9_]+$/.test(id)) {
    return (
      <MLAWorkspace user={user} current="/mla/cases/[id]" buildId={buildId} commitSha={commitSha} refreshedAt={refreshedAt}>
        <Panel title="Case not found / కేసు కనబడలేదు">
          <p>Invalid case ID.</p>
          <Link href="/mla/cases">Back to Live Cases</Link> · <Link href="/mla/dashboard">Back to Action Dashboard</Link>
        </Panel>
      </MLAWorkspace>
    );
  }

  const complaint = await db.complaints.getById(id);

  if (!complaint) {
    return (
      <MLAWorkspace user={user} current="/mla/cases/[id]" buildId={buildId} commitSha={commitSha} refreshedAt={refreshedAt}>
        <Panel title="Case not found / కేసు కనబడలేదు">
          <p>No complaint record exists for {id}.</p>
          <Link href="/mla/cases">Back to Live Cases</Link> · <Link href="/mla/dashboard">Back to Action Dashboard</Link>
        </Panel>
      </MLAWorkspace>
    );
  }

  return (
    <MLAWorkspace user={user} current="/mla/cases/[id]" buildId={buildId} commitSha={commitSha} refreshedAt={refreshedAt}>
      <Link href="/mla/cases">Back to Cases / కేసుల జాబితా</Link>
      <h1>{complaint.id}: {titleOf(complaint)}</h1>
      <Panel title="Complaint summary / ఫిర్యాదు సారాంశం">
        <p>{complaint.isSample ? "Sample presentation record" : "Live citizen complaint"} · {complaint.status} · {priority(complaint)}</p>
      </Panel>
      <Panel title="Original citizen description / అసలు పౌర వివరణ">
        <p>{complaint.description || "Description missing."}</p>
      </Panel>
      <Panel title="Location and constituency mapping / ప్రాంత సమాచారం">
        <p>Mandal: {complaint.mandal || "Missing"} · Village/Ward: {complaint.village || "Missing"} · Assembly Constituency No. 168</p>
      </Panel>
      <Panel title="Department and routing / శాఖ కేటాయింపు">
        <p>Current: {department(complaint)} · Assigned to: {complaint.assignedTo || "Unassigned"}</p>
      </Panel>
      <Panel title="AI preliminary assessment / ప్రాథమిక అంచనా">
        <p>{complaint.aiAnalysis ? `${complaint.aiAnalysis.category} · Confidence ${complaint.aiAnalysis.confidenceScore} · ${complaint.aiAnalysis.recommendedAction}` : "AI analysis missing."}</p>
        <small>{complaint.aiAnalysis?.legalDisclaimer || "Preliminary triage unavailable; human review required."}</small>
      </Panel>
      <Panel title="Safety escalation status / భద్రతా ప్రాధాన్యత">
        <p>{isSafety(complaint) ? "Safety escalation required" : "No safety escalation flag"} · Preliminary assessment is not proof or a finding of guilt.</p>
      </Panel>
      <Panel title="Evidence list / ఆధారాలు">
        {evidenceCount(complaint) ? (
          <div style={{ display: "grid", gap: 14 }}>
            {(complaint.mediaUrls || []).map((url, index) => (
              <div key={url} style={{ border: "1px solid var(--border-main)", borderRadius: 12, padding: 12 }}>
                <strong>Evidence {index + 1}</strong>
                <div style={{ marginTop: 8 }}><EvidencePreview url={url} index={index} /></div>
              </div>
            ))}
            {complaint.audioUrl && <EvidencePreview url={complaint.audioUrl} index={(complaint.mediaUrls || []).length} />}
          </div>
        ) : <Empty label="Missing evidence / ఆధారాలు లేవు." />}
      </Panel>
      <Panel title="Masked citizen contact / గోప్య సంప్రదింపు">
        <p>{maskContact(complaint)}</p>
      </Panel>
      <Panel title="Current status / ప్రస్తుత స్థితి">
        <p>{complaint.status}</p>
      </Panel>
      <Panel title="Department assignment / శాఖ బాధ్యత">
        <p>{complaint.assignedDepartment || complaint.department || "Unassigned"}</p>
      </Panel>
      <Panel title="Action timeline / చర్యల కాలక్రమం">
        {(complaint.auditLog || []).length ? (complaint.auditLog || []).map((entry, index) => (
          <p key={`${entry.timestamp}-${index}`}>{entry.timestamp} · {entry.actor} · {actionType(entry)} · {entry.notes || entry.action}</p>
        )) : <Empty label="Empty audit timeline / చర్యల చరిత్ర లేదు." />}
      </Panel>
      <Panel title="Action Dashboard notes / చర్యల గమనికలు">
        {(complaint.internalNotes || []).length ? (complaint.internalNotes || []).map((note, index) => <p key={index}>{note}</p>) : <Empty label="No monitoring notes yet / ఇంకా గమనికలు లేవు." />}
      </Panel>
      <Panel title="Action controls / చర్యలు">
        <MLACaseActionForm id={complaint.id} />
      </Panel>
    </MLAWorkspace>
  );
}
