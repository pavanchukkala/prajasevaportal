import React from 'react';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import Link from 'next/link';
import MLAChatbot from '@/components/mla/MLAChatbot';
import { EvidenceAndActionManager } from './EvidenceAndActionManager';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ComplaintDetailPage({
  params,
}: {
  params: Promise<{ complaintId: string }> | { complaintId: string };
}) {
  const session = await getSession();
  if (!session) {
    redirect('/staff/login');
  }

  const resolvedParams = await Promise.resolve(params);
  const complaintId = resolvedParams.complaintId;
  const complaint = await db.complaints.getById(complaintId);

  if (!complaint) {
    return (
      <div style={theme.page}>
        <div style={theme.container}>
          <h1 style={{ color: '#ef4444' }}>Case Not Found</h1>
          <Link href="/mla/dashboard" style={theme.backLink}>&larr; Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  const ai = complaint.aiAnalysis ?? null;

  return (
    <div style={theme.page}>
      <div style={theme.container}>
        <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/mla/dashboard" style={theme.backLink}>&larr; Back to MLA Dashboard</Link>
          <span style={{ color: '#94a3b8', fontSize: '13px' }}>
            Current Status: <strong style={{ color: '#fbbf24' }}>{complaint.status}</strong>
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          {/* Main Content */}
          <div>
            <div style={theme.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <h1 style={theme.title}>{ai?.title ?? 'Citizen Grievance Record'}</h1>
                  <p style={{ color: '#38bdf8', fontSize: '15px', fontWeight: 800, fontFamily: 'monospace', margin: 0 }}>
                    Case ID: {complaint.id} &bull; Token: {complaint.trackingToken}
                  </p>
                </div>
                <span style={{ backgroundColor: complaint.status === 'Solved' ? '#059669' : complaint.status === 'Contacted (No Response)' ? '#d97706' : '#2563eb', color: '#fff', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: 800 }}>
                  {complaint.status}
                </span>
              </div>
              
              <div style={theme.section}>
                <h3 style={theme.sectionTitle}>Full Citizen Description</h3>
                <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '16px' }}>
                  <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.7', color: '#f1f5f9', margin: 0, fontSize: '15px' }}>{complaint.description}</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '14px' }}>
                  <h3 style={theme.sectionTitle}>Location & Department</h3>
                  <p style={{ margin: '4px 0' }}><strong>Mandal:</strong> <span style={{ color: '#f8fafc' }}>{complaint.mandal || 'N/A'}</span></p>
                  <p style={{ margin: '4px 0' }}><strong>Village / Ward:</strong> <span style={{ color: '#f8fafc' }}>{complaint.village || 'N/A'}</span></p>
                  <p style={{ margin: '4px 0' }}><strong>Target Dept:</strong> <span style={{ color: '#f59e0b' }}>{complaint.department || ai?.department || 'Unassigned'}</span></p>
                </div>

                <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '14px' }}>
                  <h3 style={theme.sectionTitle}>Submission Timestamps</h3>
                  <p style={{ margin: '4px 0' }}><strong>Created:</strong> <span style={{ color: '#cbd5e1' }}>{new Date(complaint.createdAt).toLocaleString()}</span></p>
                  <p style={{ margin: '4px 0' }}><strong>Last Updated:</strong> <span style={{ color: '#cbd5e1' }}>{complaint.updatedAt ? new Date(complaint.updatedAt).toLocaleString() : 'N/A'}</span></p>
                  <p style={{ margin: '4px 0' }}><strong>Incident Date:</strong> <span style={{ color: '#cbd5e1' }}>{complaint.incidentDate || 'Not specified'}</span></p>
                </div>
              </div>

              <div style={theme.section}>
                <h3 style={theme.sectionTitle}>Citizen Contact & Direct Action</h3>
                <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '16px' }}>
                  {complaint.mobileNumber ? (
                    <div>
                      <p style={{ margin: '0 0 10px', fontSize: '15px' }}>
                        <strong>Mobile Number:</strong>{' '}
                        <span style={{ color: '#38bdf8', fontWeight: 800, fontFamily: 'monospace', fontSize: '17px' }}>
                          {complaint.mobileNumber}
                        </span>
                      </p>
                      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <a
                          href={`tel:${complaint.mobileNumber}`}
                          style={{ backgroundColor: '#10b981', color: '#000', padding: '8px 16px', borderRadius: '6px', textDecoration: 'none', fontWeight: 800, fontSize: '14px' }}
                        >
                          📞 Call Citizen Now
                        </a>
                        <a
                          href={`https://wa.me/${complaint.mobileNumber.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{ backgroundColor: '#25d366', color: '#000', padding: '8px 16px', borderRadius: '6px', textDecoration: 'none', fontWeight: 800, fontSize: '14px' }}
                        >
                          💬 Send WhatsApp Message
                        </a>
                      </div>
                    </div>
                  ) : complaint.mobileNumberMasked ? (
                    <p style={{ margin: 0 }}>
                      <strong>Contact:</strong> {complaint.mobileNumberMasked}{' '}
                      <span style={{ color: '#fbbf24', fontSize: '12px' }}>(Masked contact provided)</span>
                    </p>
                  ) : (
                    <p style={{ margin: 0 }}><strong>Contact:</strong> Confidential / Anonymous Submission</p>
                  )}
                  <p style={{ marginTop: '12px', marginBottom: 0, fontSize: '13px', color: '#94a3b8' }}>
                    <strong>Notification Consent:</strong> {complaint.consentGiven ? 'Yes (Consented to direct SMS/WhatsApp updates)' : 'No'}
                  </p>
                </div>
              </div>

              {/* Evidence Player & Manager */}
              <EvidenceAndActionManager
                complaintId={complaint.id}
                initialMediaUrls={complaint.mediaUrls || []}
                currentStatus={complaint.status}
                currentDept={complaint.department}
                currentNotes={complaint.internalNotes}
              />

              {complaint.internalNotes && (
                <div style={theme.section}>
                  <h3 style={theme.sectionTitle}>Internal Notes History</h3>
                  <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '14px' }}>
                    <p style={{ fontStyle: 'italic', color: '#cbd5e1', margin: 0, whiteSpace: 'pre-wrap' }}>
                      {Array.isArray(complaint.internalNotes) ? complaint.internalNotes.join('\n') : complaint.internalNotes}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div style={theme.card}>
              <h2 style={theme.title}>Audit Log & Workflow History</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {complaint.auditLog?.map((log: any, i: number) => (
                  <div key={i} style={{ borderLeft: '2px solid #38bdf8', paddingLeft: '16px' }}>
                    <p style={{ color: '#94a3b8', fontSize: '12px', margin: '0 0 4px' }}>
                      {new Date(log.timestamp).toLocaleString()} &mdash; <strong style={{ color: '#fbbf24' }}>{log.actor}</strong>
                    </p>
                    <p style={{ margin: 0, color: '#f8fafc', fontSize: '14px' }}>
                      <strong>{log.action}</strong>
                      {log.details && `: ${log.details}`}
                    </p>
                  </div>
                ))}
                {(!complaint.auditLog || complaint.auditLog.length === 0) && (
                  <p style={{ color: '#94a3b8' }}>No audit history available.</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div style={theme.card}>
              <h2 style={theme.title}>Intelligence Assessment</h2>
              <div style={{ marginBottom: '16px' }}>
                <span style={{ 
                  backgroundColor: ai?.analysisMode === 'local_fallback' ? '#64748b' : '#3b82f6', 
                  color: '#fff', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 800 
                }}>
                  {ai?.analysisMode === 'local_fallback' ? 'Local Fallback' : 'Platform Intel Engine'}
                </span>
              </div>
              
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li><strong>Category:</strong> {ai?.category ?? 'Public Grievance'}</li>
                <li><strong>Subcategory:</strong> {ai?.subcategory ?? 'N/A'}</li>
                <li><strong>Urgency:</strong> <span style={{ color: ai?.urgency === 'Emergency' || ai?.urgency === 'High' ? '#ef4444' : '#fbbf24', fontWeight: 800 }}>{ai?.urgency ?? 'Routine'}</span></li>
                <li><strong>Credibility Band:</strong> {ai?.credibilityBand ?? 'High Credibility'}</li>
                <li><strong>Confidence Score:</strong> {ai?.confidenceScore ?? '0.90'}</li>
                <li><strong>Assigned Dept:</strong> {complaint.department || ai?.department || 'Unassigned'}</li>
              </ul>

              {ai?.recommendedAction && (
                <div style={{ marginTop: '16px', background: 'rgba(251,191,36,0.1)', border: '1px solid #fbbf24', borderRadius: '8px', padding: '12px' }}>
                  <strong style={{ color: '#fbbf24', fontSize: '13px' }}>💡 Executive Recommended Directive:</strong>
                  <p style={{ fontSize: '13px', color: '#f1f5f9', margin: '6px 0 0', lineHeight: 1.5 }}>{ai.recommendedAction}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <MLAChatbot />
    </div>
  );
}

const theme = {
  page: { minHeight: '100vh', backgroundColor: '#0f172a', color: '#f8fafc', fontFamily: 'sans-serif', paddingBottom: '40px' },
  container: { maxWidth: '1200px', margin: '0 auto', padding: '24px' },
  card: { backgroundColor: '#1e293b', borderRadius: '8px', padding: '24px', border: '1px solid #334155', marginBottom: '24px' },
  title: { fontSize: '20px', color: '#f8fafc', margin: '0 0 16px', borderBottom: '1px solid #334155', paddingBottom: '12px' },
  section: { marginBottom: '20px' },
  sectionTitle: { fontSize: '14px', color: '#fbbf24', textTransform: 'uppercase' as const, letterSpacing: '0.05em', marginBottom: '8px' },
  backLink: { color: '#fbbf24', textDecoration: 'none', fontWeight: 'bold' },
  label: { display: 'block', fontSize: '14px', color: '#94a3b8', marginBottom: '8px' },
  input: { width: '100%', padding: '10px', backgroundColor: '#0f172a', border: '1px solid #334155', color: '#f8fafc', borderRadius: '4px', boxSizing: 'border-box' as const },
  button: { width: '100%', padding: '12px', backgroundColor: '#fbbf24', color: '#0f172a', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }
};
