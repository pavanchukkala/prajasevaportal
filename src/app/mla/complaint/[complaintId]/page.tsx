import React from 'react';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import Link from 'next/link';

export default async function ComplaintDetailPage({
  params,
}: {
  params: { complaintId: string };
}) {
  const session = await getSession();
  if (!session) {
    redirect('/staff/login');
  }

  const { complaintId } = params;
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
      {complaint.isSample && (
        <div style={{ backgroundColor: '#8b5cf6', color: '#fff', padding: '12px', textAlign: 'center', fontWeight: 'bold' }}>
          SAMPLE PRESENTATION RECORD — This is generated sample data, not a live case.
        </div>
      )}
      
      <div style={theme.container}>
        <div style={{ marginBottom: '24px' }}>
          <Link href="/mla/dashboard" style={theme.backLink}>&larr; Back to Dashboard</Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          {/* Main Content */}
          <div>
            <div style={theme.card}>
              <h1 style={theme.title}>{ai?.title ?? 'Untitled Case'}</h1>
              <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '24px' }}>Case ID: {complaint.id}</p>
              
              <div style={theme.section}>
                <h3 style={theme.sectionTitle}>Original Description</h3>
                <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{complaint.description}</p>
              </div>

              <div style={theme.section}>
                <h3 style={theme.sectionTitle}>Location Details</h3>
                <p><strong>Mandal:</strong> {complaint.mandal || 'N/A'}</p>
                <p><strong>Village/Ward:</strong> {complaint.village || 'N/A'}</p>
              </div>

              <div style={theme.section}>
                <h3 style={theme.sectionTitle}>Contact & Metadata</h3>
                {complaint.mobileNumberMasked ? (
                  <p><strong>Contact:</strong> {complaint.mobileNumberMasked} <span style={{color: '#ef4444', fontSize: '12px'}}>(Masked — full number not accessible via UI)</span></p>
                ) : (
                  <p><strong>Contact:</strong> Not provided / Anonymous</p>
                )}
                <p><strong>Consent Given:</strong> {complaint.consentGiven ? 'Yes' : 'No'}</p>
                <p><strong>Created:</strong> {new Date(complaint.createdAt).toLocaleString()}</p>
                <p><strong>Updated:</strong> {complaint.updatedAt ? new Date(complaint.updatedAt).toLocaleString() : 'N/A'}</p>
              </div>

              {complaint.internalNotes && (
                <div style={theme.section}>
                  <h3 style={theme.sectionTitle}>Internal Notes</h3>
                  <p style={{ fontStyle: 'italic', color: '#cbd5e1' }}>{Array.isArray(complaint.internalNotes) ? complaint.internalNotes.join('\n') : complaint.internalNotes}</p>
                </div>
              )}
            </div>

            <div style={theme.card}>
              <h2 style={theme.title}>Audit Log Timeline</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {complaint.auditLog?.map((log: any, i: number) => (
                  <div key={i} style={{ borderLeft: '2px solid #334155', paddingLeft: '16px' }}>
                    <p style={{ color: '#94a3b8', fontSize: '12px', margin: '0 0 4px' }}>
                      {new Date(log.timestamp).toLocaleString()} — {log.actor}
                    </p>
                    <p style={{ margin: 0, color: '#f8fafc' }}>
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
              <h2 style={theme.title}>AI Analysis</h2>
              <div style={{ marginBottom: '16px' }}>
                <span style={{ 
                  backgroundColor: ai?.analysisMode === 'local_fallback' ? '#64748b' : '#3b82f6', 
                  color: '#fff', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' 
                }}>
                  {ai?.analysisMode === 'local_fallback' ? 'Local Fallback' : 'LLM Processed'}
                </span>
              </div>
              
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li><strong>Category:</strong> {ai?.category ?? 'N/A'}</li>
                <li><strong>Subcategory:</strong> {ai?.subcategory ?? 'N/A'}</li>
                <li><strong>Urgency:</strong> <span style={{ color: ai?.urgency === 'High' ? '#ef4444' : '#fbbf24' }}>{ai?.urgency ?? 'N/A'}</span></li>
                <li><strong>Credibility Band:</strong> {ai?.credibilityBand ?? 'N/A'}</li>
                <li><strong>Confidence Score:</strong> {ai?.confidenceScore ?? 'N/A'}</li>
                <li><strong>Dept:</strong> {complaint.department || 'Unassigned'}</li>
                <li><strong>Status:</strong> <span style={{ color: '#10b981' }}>{complaint.status}</span></li>
              </ul>
              
              {ai?.evidenceCompleteness && (
                <div style={{ marginTop: '16px' }}>
                  <strong>Evidence Completeness:</strong>
                  <p style={{ fontSize: '14px', color: '#cbd5e1' }}>{ai.evidenceCompleteness}</p>
                </div>
              )}
              
              {ai?.missingInformation && ai.missingInformation.length > 0 && (
                <div style={{ marginTop: '16px' }}>
                  <strong>Missing Information:</strong>
                  <ul style={{ fontSize: '14px', color: '#cbd5e1', paddingLeft: '20px' }}>
                    {ai.missingInformation.map((item: string, i: number) => <li key={i}>{item}</li>)}
                  </ul>
                </div>
              )}

              {ai?.recommendedAction && (
                <div style={{ marginTop: '16px' }}>
                  <strong>Recommended Action:</strong>
                  <p style={{ fontSize: '14px', color: '#fbbf24' }}>{ai.recommendedAction}</p>
                </div>
              )}

              {ai?.legalDisclaimer && (
                <div style={{ marginTop: '24px', fontSize: '11px', color: '#64748b', borderTop: '1px solid #334155', paddingTop: '12px' }}>
                  {ai.legalDisclaimer}
                </div>
              )}
            </div>

            {/* Action Panel */}
            <LiveActionPanel 
              complaintId={complaint.id} 
              currentStatus={complaint.status} 
              currentDept={complaint.department} 
              currentNotes={complaint.internalNotes} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Client Component for the Action Panel
const LiveActionPanel = ({ complaintId, currentStatus, currentDept, currentNotes }: any) => {
  return (
    <div style={{...theme.card, border: '1px solid #fbbf24', marginTop: '24px'}}>
      <h2 style={{...theme.title, color: '#fbbf24'}}>Case Actions</h2>
      
      <form 
        style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          
          fetch(`/api/complaints/${complaintId}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              status: formData.get('status'),
              department: formData.get('department'),
              assignee: formData.get('assignee'),
              internalNotes: formData.get('internalNotes')
            })
          })
          .then(res => res.json())
          .then(data => {
            if(data.success) {
              alert('Successfully updated case.');
              window.location.reload();
            } else {
              alert('Failed to update case.');
            }
          })
          .catch(() => alert('Error updating case.'));
        }}
      >
        <div>
          <label style={theme.label}>Update Status</label>
          <select name="status" defaultValue={currentStatus} style={theme.input}>
            <option value="New">New</option>
            <option value="AI Processed">AI Processed</option>
            <option value="Under Review">Under Review</option>
            <option value="More Information Requested">More Information Requested</option>
            <option value="Assigned">Assigned</option>
            <option value="Escalated">Escalated</option>
            <option value="Action Reported">Action Reported</option>
            <option value="Resolved">Resolved</option>
            <option value="Reopened">Reopened</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        <div>
          <label style={theme.label}>Department Assignment</label>
          <input type="text" name="department" defaultValue={currentDept || ''} placeholder="e.g. Revenue, Police..." style={theme.input} />
        </div>

        <div>
          <label style={theme.label}>Assign to Reviewer</label>
          <input type="text" name="assignee" placeholder="Reviewer Name/ID" style={theme.input} />
        </div>

        <div>
          <label style={theme.label}>Internal Notes (Appends)</label>
          <textarea name="internalNotes" defaultValue={currentNotes || ''} rows={4} placeholder="Add confidential notes..." style={{...theme.input, resize: 'vertical'}}></textarea>
        </div>

        <button type="submit" style={theme.button}>Save Changes</button>
      </form>
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
