import React from 'react';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import Link from 'next/link';

export default async function MLADashboard({
  searchParams,
}: {
  searchParams: { tab?: string };
}) {
  const session = await getSession();
  if (!session) {
    redirect('/staff/login');
  }

  const allComplaints = await db.complaints.list();
  
  const currentTab = searchParams.tab || 'all';

  let filteredComplaints = allComplaints;
  if (currentTab === 'live') {
    filteredComplaints = allComplaints.filter((c: any) => !c.isSample);
  } else if (currentTab === 'sample') {
    filteredComplaints = allComplaints.filter((c: any) => c.isSample);
  }

  const total = allComplaints.length;
  const liveCount = allComplaints.filter((c: any) => !c.isSample).length;
  const sampleCount = allComplaints.filter((c: any) => c.isSample).length;
  const highPriority = allComplaints.filter((c: any) => c.aiAnalysis?.urgency === 'High').length;
  const underReview = allComplaints.filter((c: any) => c.status === 'Under Review').length;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#f8fafc', fontFamily: 'sans-serif' }}>
      {/* AI Disclaimer Banner */}
      <div style={{ backgroundColor: '#f59e0b', color: '#000', padding: '12px', textAlign: 'center', fontWeight: 'bold' }}>
        This dashboard contains AI-processed data. Please review carefully.
      </div>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ color: '#fbbf24', fontSize: '28px', margin: 0 }}>MLA Case Dashboard</h1>
            <p style={{ color: '#cbd5e1', margin: '8px 0 0' }}>Constituency Intelligence Platform</p>
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <span style={{ color: '#94a3b8' }}>Authorized Staff</span>
          </div>
        </header>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          <StatCard title="Total Cases" value={total} />
          <StatCard title="Live Submissions" value={liveCount} highlight />
          <StatCard title="High Priority" value={highPriority} danger />
          <StatCard title="Under Review" value={underReview} />
          <StatCard title="Sample Data" value={sampleCount} />
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '1px solid #1e293b', paddingBottom: '12px' }}>
          <TabLink active={currentTab === 'all'} href="?tab=all" label="All Cases" />
          <TabLink active={currentTab === 'live'} href="?tab=live" label="Live Submissions" />
          <TabLink active={currentTab === 'sample'} href="?tab=sample" label="Sample Data" />
        </div>

        {/* Cases Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
          {filteredComplaints.map((c: any) => (
            <div key={c.id} style={{ backgroundColor: '#1e293b', borderRadius: '8px', padding: '20px', border: '1px solid #334155', position: 'relative' }}>
              {/* Badges */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                <Badge label={c.status} color="#3b82f6" />
                {c.isSample && <Badge label="Sample" color="#8b5cf6" />}
                {(!c.isSample && (c.isAnonymous || c.status === 'New')) && <Badge label="NEW" color="#ef4444" />}
                {c.aiAnalysis?.urgency && (
                  <Badge 
                    label={c.aiAnalysis.urgency} 
                    color={c.aiAnalysis.urgency === 'High' ? '#ef4444' : c.aiAnalysis.urgency === 'Medium' ? '#f59e0b' : '#10b981'} 
                  />
                )}
              </div>

              <h2 style={{ fontSize: '18px', color: '#fbbf24', margin: '0 0 12px', lineHeight: '1.4' }}>
                {c.aiAnalysis?.title || (c.description ? c.description.slice(0, 60) + '...' : 'Untitled Case')}
              </h2>
              
              <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '16px' }}>
                <p style={{ margin: '4px 0' }}><strong>ID:</strong> {c.id}</p>
                <p style={{ margin: '4px 0' }}><strong>Mandal:</strong> {c.mandal || 'N/A'}</p>
                {c.mobileNumberMasked && (
                  <p style={{ margin: '4px 0' }}><strong>Contact:</strong> {c.mobileNumberMasked}</p>
                )}
                {c.aiAnalysis?.credibilityBand && (
                  <p style={{ margin: '4px 0' }}><strong>Credibility:</strong> {c.aiAnalysis.credibilityBand}</p>
                )}
              </div>

              <Link href={`/mla/complaint/${c.id}`} style={{
                display: 'inline-block',
                backgroundColor: '#fbbf24',
                color: '#0f172a',
                padding: '8px 16px',
                borderRadius: '4px',
                textDecoration: 'none',
                fontWeight: 'bold',
                fontSize: '14px',
              }}>
                Review Case &rarr;
              </Link>
            </div>
          ))}
          {filteredComplaints.length === 0 && (
            <div style={{ color: '#94a3b8', padding: '24px 0' }}>No cases found for this category.</div>
          )}
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, highlight, danger }: { title: string, value: number, highlight?: boolean, danger?: boolean }) {
  return (
    <div style={{ 
      backgroundColor: '#1e293b', 
      padding: '20px', 
      borderRadius: '8px',
      borderLeft: `4px solid ${highlight ? '#3b82f6' : danger ? '#ef4444' : '#fbbf24'}`
    }}>
      <div style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '8px' }}>{title}</div>
      <div style={{ color: '#f8fafc', fontSize: '28px', fontWeight: 'bold' }}>{value}</div>
    </div>
  );
}

function TabLink({ active, href, label }: { active: boolean, href: string, label: string }) {
  return (
    <Link href={href} style={{
      padding: '8px 16px',
      color: active ? '#fbbf24' : '#cbd5e1',
      backgroundColor: active ? '#1e293b' : 'transparent',
      borderRadius: '4px',
      textDecoration: 'none',
      fontWeight: active ? 'bold' : 'normal',
      border: active ? '1px solid #334155' : '1px solid transparent',
    }}>
      {label}
    </Link>
  );
}

function Badge({ label, color }: { label: string, color: string }) {
  return (
    <span style={{
      backgroundColor: `${color}20`,
      color: color,
      border: `1px solid ${color}40`,
      padding: '2px 8px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: 'bold'
    }}>
      {label}
    </span>
  );
}
