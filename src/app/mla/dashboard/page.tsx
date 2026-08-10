import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import MLASidebarNav from "@/components/mla/MLASidebarNav";
import MLAChatbot from "@/components/mla/MLAChatbot";
import MandalFilter from "@/components/mla/MandalFilter";

export const dynamic = "force-dynamic";

export interface MLADashboardProps {
  searchParams?: Promise<{ nav?: string; tab?: string; mandal?: string; search?: string }> | { nav?: string; tab?: string; mandal?: string; search?: string };
}

// Clean helper to extract filename without query string tokens that cause UI overflow
function formatFileName(url: string, idx: number): string {
  try {
    const withoutQuery = url.split("?")[0];
    let name = withoutQuery.split("/").pop() || `Evidence #${idx + 1}`;
    name = decodeURIComponent(name);
    if (name.length > 28) {
      name = name.slice(0, 25) + "...";
    }
    return name;
  } catch {
    return `Evidence #${idx + 1}`;
  }
}

// Mask citizen phone number for privacy compliance
function maskMobile(mobile?: string): string {
  if (!mobile) return "Anonymous Submission";
  const cleaned = mobile.replace(/\D/g, "");
  if (cleaned.length >= 10) {
    return `+91 ${cleaned.slice(0, 5)} *****`;
  }
  return "Masked Contact";
}

export default async function MLADashboard({ searchParams }: MLADashboardProps) {
  const session = await getSession();
  if (!session) {
    redirect("/staff/login?redirect=/mla/dashboard");
  }

  let allComplaints: any[] = [];
  let errorState: string | null = null;

  try {
    allComplaints = await db.complaints.list();
  } catch (err: any) {
    console.error("[MLA Dashboard] Error querying live complaint records:", err);
    errorState = "Failed to retrieve live complaints from the database provider.";
  }

  const resolvedSearchParams = await Promise.resolve(searchParams ?? {});
  const currentNav = resolvedSearchParams.nav || "overview";
  const currentTab = resolvedSearchParams.tab || "all";
  const currentMandal = resolvedSearchParams.mandal || "all";
  const searchQuery = (resolvedSearchParams.search || "").toLowerCase().trim();

  // Separate Live Citizen Records from Sample Records
  const liveComplaints = allComplaints.filter((c) => !c.isSample);
  const sampleComplaints = allComplaints.filter((c) => c.isSample);

  // Exact Metric Calculations from Database Records
  const totalLive = liveComplaints.length;
  const highPriorityCount = liveComplaints.filter(
    (c) => c.aiAnalysis?.urgency === "Emergency" || c.aiAnalysis?.urgency === "Critical" || c.aiAnalysis?.urgency === "High"
  ).length;

  const viewedCount = liveComplaints.filter((c) => c.status === "Viewed").length;
  const contactedCount = liveComplaints.filter((c) => c.status === "Contacted (No Response)").length;
  const underReviewCount = liveComplaints.filter((c) =>
    ["New", "AI Processed", "Under Review", "More Information Requested"].includes(c.status)
  ).length;

  const assignedCount = liveComplaints.filter((c) =>
    ["Assigned", "Escalated", "Action Reported"].includes(c.status)
  ).length;

  const resolvedCount = liveComplaints.filter((c) =>
    ["Solved", "Resolved", "Closed"].includes(c.status)
  ).length;

  const latestUpdate = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  const counts = {
    totalLive,
    highPriority: highPriorityCount,
    underReview: underReviewCount,
    assigned: assignedCount,
    resolved: resolvedCount,
    viewed: viewedCount,
    contacted: contactedCount,
  };

  const appVer = process.env.RENDER_GIT_COMMIT?.slice(0, 7) || process.env.NEXT_PUBLIC_APP_VERSION || "8d92257";

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#04091a", color: "#f8fafc", fontFamily: "sans-serif", display: "flex", flexDirection: "column" }}>
      {/* Top Banner */}
      <div style={{ backgroundColor: "#fbbf24", color: "#0f172a", padding: "8px 16px", textAlign: "center", fontWeight: 800, fontSize: "12.5px" }}>
        🏛️ SRIKALAHASTI CONSTITUENCY NO. 168 · AUTHENTICATED MLA EXECUTIVE WORKSPACE · BUILD v{appVer}
      </div>

      <div style={{ flex: 1, display: "flex", minHeight: "calc(100vh - 35px)" }}>
        {/* Navigation Sidebar with all 9 items */}
        <MLASidebarNav currentNav={currentNav} counts={counts} />

        {/* Main Workspace Area */}
        <main style={{ flex: 1, padding: "24px", maxWidth: "1280px", margin: "0 auto", width: "100%" }}>
          {/* Top Breadcrumb & User Status Bar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: "1px solid #1e293b", paddingBottom: "12px", flexWrap: "wrap", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#94a3b8" }}>
              <Link href="/mla/dashboard" style={{ color: "#fbbf24", textDecoration: "none", fontWeight: 700 }}>
                MLA Dashboard
              </Link>
              <span>/</span>
              <span style={{ color: "#f8fafc", fontWeight: 600, textTransform: "capitalize" }}>
                {currentNav.replace("-", " ")}
              </span>
            </div>
            <div style={{ fontSize: "12.5px", color: "#94a3b8" }}>
              Logged in as <strong style={{ color: "#38bdf8" }}>{session.username}</strong> ({session.role}) · Build: <strong style={{ color: "#a855f7" }}>v{appVer}</strong> · Sync: <span style={{ color: "#10b981" }}>{latestUpdate}</span>
            </div>
          </div>

          {/* Error State with Retry Button */}
          {errorState && (
            <div style={{ backgroundColor: "rgba(239, 68, 68, 0.15)", border: "1px solid #ef4444", borderRadius: "10px", padding: "16px", marginBottom: "24px", color: "#f87171" }}>
              <div style={{ fontWeight: 800, fontSize: "15px", marginBottom: "4px" }}>⚠ Database Connection Issue</div>
              <div style={{ fontSize: "13px" }}>{errorState}</div>
              <a href="/mla/dashboard" style={{ display: "inline-block", marginTop: "10px", backgroundColor: "#ef4444", color: "#fff", padding: "6px 14px", borderRadius: "6px", textDecoration: "none", fontWeight: 800, fontSize: "12px" }}>
                🔄 Retry Connection
              </a>
            </div>
          )}

          {/* VIEW 1: OVERVIEW */}
          {(currentNav === "overview" || !currentNav) && (
            <div>
              <div style={{ marginBottom: "24px" }}>
                <h1 style={{ fontSize: "24px", color: "#ffffff", fontWeight: 900, margin: 0 }}>Executive Overview</h1>
                <p style={{ color: "#94a3b8", fontSize: "13.5px", margin: "4px 0 0" }}>
                  Real-time grievance intelligence dashboard for Assembly Constituency No. 168.
                </p>
              </div>

              {/* Executive Metrics Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "28px" }}>
                <MetricCard title="Total Live Complaints" value={totalLive} color="#3b82f6" subtext="Real citizen submissions" />
                <MetricCard title="Emergency / High Priority" value={highPriorityCount} color="#ef4444" subtext="Requires priority review" danger />
                <MetricCard title="Under Review" value={underReviewCount} color="#facc15" subtext="Awaiting initial triage" />
                <MetricCard title="Assigned / Action" value={assignedCount} color="#38bdf8" subtext="Field work ongoing" />
                <MetricCard title="Resolved / Solved" value={resolvedCount} color="#10b981" subtext="Verified closed cases" />
              </div>

              {/* Mandal Breakdown Quick Panel */}
              <div style={{ backgroundColor: "#1e293b", borderRadius: "12px", border: "1px solid #334155", padding: "20px", marginBottom: "28px" }}>
                <h3 style={{ fontSize: "15px", color: "#fbbf24", margin: "0 0 14px", fontWeight: 800 }}>
                  📍 Mandal Breakdown (Live Cases)
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px" }}>
                  {["Srikalahasti", "Yerpedu", "Thottambedu", "Renigunta"].map((m) => {
                    const mCount = liveComplaints.filter((c) => (c.mandal || "").toLowerCase() === m.toLowerCase()).length;
                    return (
                      <Link
                        key={m}
                        href={`/mla/dashboard?nav=live-complaints&mandal=${encodeURIComponent(m)}`}
                        style={{
                          backgroundColor: "#0f172a",
                          border: "1px solid #334155",
                          borderRadius: "8px",
                          padding: "12px",
                          textDecoration: "none",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span style={{ color: "#f8fafc", fontWeight: 700, fontSize: "13px" }}>{m}</span>
                        <span style={{ backgroundColor: "#38bdf8", color: "#0f172a", fontWeight: 900, fontSize: "12px", padding: "2px 8px", borderRadius: "10px" }}>
                          {mCount}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Recent Live Grievance Feed */}
              <div style={{ marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ fontSize: "16px", color: "#ffffff", margin: 0, fontWeight: 800 }}>
                  🟢 Recent Live Citizen Grievances ({liveComplaints.length})
                </h3>
                <Link href="/mla/dashboard?nav=live-complaints" style={{ color: "#38bdf8", fontSize: "13px", textDecoration: "none", fontWeight: 700 }}>
                  View All Live Complaints &rarr;
                </Link>
              </div>

              {liveComplaints.length === 0 ? (
                <EmptyStateMessage />
              ) : (
                <ComplaintsGrid complaints={liveComplaints.slice(0, 6)} />
              )}
            </div>
          )}

          {/* VIEW 2: LIVE COMPLAINTS */}
          {currentNav === "live-complaints" && (
            <div>
              <div style={{ marginBottom: "20px" }}>
                <h1 style={{ fontSize: "24px", color: "#ffffff", fontWeight: 900, margin: 0 }}>🟢 Live Citizen Complaints</h1>
                <p style={{ color: "#94a3b8", fontSize: "13.5px", margin: "4px 0 0" }}>
                  Filter and triage live citizen complaints across all mandals.
                </p>
              </div>

              {/* Filters Bar */}
              <div style={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "10px", padding: "14px", marginBottom: "20px", display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <TabFilterLink active={currentTab === "all"} href={`/mla/dashboard?nav=live-complaints&tab=all&mandal=${currentMandal}`} label={`All (${totalLive})`} />
                  <TabFilterLink active={currentTab === "viewed"} href={`/mla/dashboard?nav=live-complaints&tab=viewed&mandal=${currentMandal}`} label={`👁️ Viewed (${viewedCount})`} />
                  <TabFilterLink active={currentTab === "contacted"} href={`/mla/dashboard?nav=live-complaints&tab=contacted&mandal=${currentMandal}`} label={`📞 Contacted (${contactedCount})`} />
                  <TabFilterLink active={currentTab === "new"} href={`/mla/dashboard?nav=live-complaints&tab=new&mandal=${currentMandal}`} label={`Pending (${underReviewCount})`} />
                  <TabFilterLink active={currentTab === "assigned"} href={`/mla/dashboard?nav=live-complaints&tab=assigned&mandal=${currentMandal}`} label={`Assigned (${assignedCount})`} />
                  <TabFilterLink active={currentTab === "solved" || currentTab === "resolved"} href={`/mla/dashboard?nav=live-complaints&tab=solved&mandal=${currentMandal}`} label={`✅ Solved (${resolvedCount})`} />
                </div>
                <MandalFilter currentTab={currentTab} currentMandal={currentMandal} />
              </div>

              {/* Filter Execution */}
              {(() => {
                let filtered = liveComplaints;
                if (currentMandal !== "all") {
                  filtered = filtered.filter((c) => (c.mandal || "").toLowerCase() === currentMandal.toLowerCase());
                }
                if (currentTab === "viewed") {
                  filtered = filtered.filter((c) => c.status === "Viewed");
                } else if (currentTab === "contacted") {
                  filtered = filtered.filter((c) => c.status === "Contacted (No Response)");
                } else if (currentTab === "new") {
                  filtered = filtered.filter((c) => ["New", "AI Processed", "Under Review", "More Information Requested"].includes(c.status));
                } else if (currentTab === "assigned") {
                  filtered = filtered.filter((c) => ["Assigned", "Escalated", "Action Reported"].includes(c.status));
                } else if (currentTab === "solved" || currentTab === "resolved") {
                  filtered = filtered.filter((c) => ["Solved", "Resolved", "Closed"].includes(c.status));
                }

                if (filtered.length === 0) {
                  return <EmptyStateMessage />;
                }
                return <ComplaintsGrid complaints={filtered} />;
              })()}
            </div>
          )}

          {/* VIEW 3: PRIORITY & SAFETY */}
          {currentNav === "priority-safety" && (
            <div>
              <div style={{ marginBottom: "20px" }}>
                <h1 style={{ fontSize: "24px", color: "#f87171", fontWeight: 900, margin: 0 }}>🚨 Priority & Safety Command Board</h1>
                <p style={{ color: "#94a3b8", fontSize: "13.5px", margin: "4px 0 0" }}>
                  High-urgency emergency alerts, sexual violence, child abuse, and threat to life cases requiring immediate intervention.
                </p>
              </div>

              {(() => {
                const priorityCases = liveComplaints.filter(
                  (c) =>
                    c.aiAnalysis?.urgency === "Emergency" ||
                    c.aiAnalysis?.urgency === "Critical" ||
                    c.aiAnalysis?.urgency === "High" ||
                    c.aiAnalysis?.safetyEscalationRequired
                );

                if (priorityCases.length === 0) {
                  return (
                    <div style={{ backgroundColor: "#1e293b", border: "1px dashed #10b981", borderRadius: "12px", padding: "32px", textAlign: "center" }}>
                      <div style={{ fontSize: "24px", marginBottom: "8px" }}>🟢</div>
                      <h3 style={{ color: "#10b981", margin: "0 0 6px" }}>No Critical Safety Escalations</h3>
                      <p style={{ color: "#94a3b8", fontSize: "13.5px", margin: 0 }}>
                        All current citizen grievances are operating under routine urgency levels.
                      </p>
                    </div>
                  );
                }
                return <ComplaintsGrid complaints={priorityCases} />;
              })()}
            </div>
          )}

          {/* VIEW 4: CONSTITUENCY */}
          {currentNav === "constituency" && (
            <div>
              <div style={{ marginBottom: "20px" }}>
                <h1 style={{ fontSize: "24px", color: "#fbbf24", fontWeight: 900, margin: 0 }}>🏛️ Srikalahasti Constituency Map</h1>
                <p style={{ color: "#94a3b8", fontSize: "13.5px", margin: "4px 0 0" }}>
                  Mandal & Gram Panchayat administrative breakdown for Assembly Constituency No. 168, Tirupati District.
                </p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px" }}>
                {[
                  { name: "Srikalahasti Mandal & Municipality", head: "Tahsildar / MRO Office, Srikalahasti", depts: "Revenue, Municipal, Police, R&B" },
                  { name: "Yerpedu Mandal", head: "MRO Office, Yerpedu", depts: "Revenue, Panchayat Raj, RWS" },
                  { name: "Thottambedu Mandal", head: "MRO Office, Thottambedu", depts: "Revenue, Agriculture, Transco" },
                  { name: "Renigunta Mandal (Part)", head: "MRO Office, Renigunta", depts: "Revenue, Police, Municipal" },
                ].map((m) => {
                  const mCases = liveComplaints.filter((c) => (c.mandal || "").toLowerCase().includes(m.name.split(" ")[0].toLowerCase()));
                  return (
                    <div key={m.name} style={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "12px", padding: "20px" }}>
                      <h3 style={{ color: "#fbbf24", margin: "0 0 8px", fontSize: "16px", fontWeight: 800 }}>{m.name}</h3>
                      <p style={{ color: "#cbd5e1", fontSize: "13px", margin: "0 0 6px" }}>🏢 {m.head}</p>
                      <p style={{ color: "#94a3b8", fontSize: "12px", margin: "0 0 14px" }}>Key Depts: {m.depts}</p>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #334155", paddingTop: "12px" }}>
                        <span style={{ color: "#64748b", fontSize: "12px" }}>Live Cases:</span>
                        <strong style={{ color: "#38bdf8", fontSize: "16px" }}>{mCases.length}</strong>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* VIEW 5: DEPARTMENT PERFORMANCE */}
          {currentNav === "department-performance" && (
            <div>
              <div style={{ marginBottom: "20px" }}>
                <h1 style={{ fontSize: "24px", color: "#38bdf8", fontWeight: 900, margin: 0 }}>🏢 Department SLA Performance</h1>
                <p style={{ color: "#94a3b8", fontSize: "13.5px", margin: "4px 0 0" }}>
                  Field department resolution efficiency and SLA compliance metrics.
                </p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
                {[
                  "Revenue",
                  "Police / Law & Order",
                  "Municipal Administration",
                  "Panchayat Raj",
                  "Roads & Buildings",
                  "AP Transco",
                  "Rural Water Supply",
                  "Women & Child Welfare",
                ].map((dept) => {
                  const dCases = liveComplaints.filter(
                    (c) => (c.assignedDepartment || c.department || c.aiAnalysis?.department || "").toLowerCase().includes(dept.toLowerCase())
                  );
                  const dResolved = dCases.filter((c) => ["Resolved", "Closed"].includes(c.status)).length;
                  const dPending = dCases.length - dResolved;

                  return (
                    <div key={dept} style={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "10px", padding: "16px" }}>
                      <div style={{ fontWeight: 800, color: "#f8fafc", fontSize: "14.5px", marginBottom: "8px" }}>{dept}</div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", fontSize: "12px", marginTop: "12px", borderTop: "1px solid #334155", paddingTop: "8px" }}>
                        <div><span style={{ color: "#64748b" }}>Total:</span> <strong style={{ color: "#38bdf8" }}>{dCases.length}</strong></div>
                        <div><span style={{ color: "#64748b" }}>Pending:</span> <strong style={{ color: "#facc15" }}>{dPending}</strong></div>
                        <div><span style={{ color: "#64748b" }}>Resolved:</span> <strong style={{ color: "#10b981" }}>{dResolved}</strong></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* VIEW 6: ACTION TAKEN */}
          {currentNav === "action-taken" && (
            <div>
              <div style={{ marginBottom: "20px" }}>
                <h1 style={{ fontSize: "24px", color: "#34d399", fontWeight: 900, margin: 0 }}>📋 Official Action Taken Register</h1>
                <p style={{ color: "#94a3b8", fontSize: "13.5px", margin: "4px 0 0" }}>
                  Verified field progress logs, work orders issued, and resolution records.
                </p>
              </div>

              {(() => {
                const actionCases = liveComplaints.filter((c) => ["Assigned", "Action Reported", "Resolved", "Closed"].includes(c.status));
                if (actionCases.length === 0) {
                  return <EmptyStateMessage />;
                }
                return <ComplaintsGrid complaints={actionCases} />;
              })()}
            </div>
          )}

          {/* VIEW 7: REPORTS */}
          {currentNav === "reports" && (
            <div>
              <div style={{ marginBottom: "20px" }}>
                <h1 style={{ fontSize: "24px", color: "#c084fc", fontWeight: 900, margin: 0 }}>📈 Constituency Executive Intelligence Report</h1>
                <p style={{ color: "#94a3b8", fontSize: "13.5px", margin: "4px 0 0" }}>
                  Generated executive briefing report for MLA constituent review.
                </p>
              </div>

              <div style={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "12px", padding: "24px" }}>
                <h3 style={{ color: "#fbbf24", margin: "0 0 16px" }}>Executive Summary — Assembly Constituency No. 168</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", fontSize: "13.5px", marginBottom: "20px" }}>
                  <div>Total Real Citizen Cases: <strong>{totalLive}</strong></div>
                  <div>High Priority / Safety Escalations: <strong>{highPriorityCount}</strong></div>
                  <div>Department Work Orders Ongoing: <strong>{assignedCount}</strong></div>
                  <div>Successfully Resolved Cases: <strong>{resolvedCount}</strong></div>
                </div>
                <div style={{ borderTop: "1px solid #334155", paddingTop: "16px", color: "#94a3b8", fontSize: "12.5px" }}>
                  ℹ️ This report is auto-generated from live SQLite database records. No sample data included.
                </div>
              </div>
            </div>
          )}

          {/* VIEW 8: PROFILE / SETTINGS */}
          {currentNav === "profile-settings" && (
            <div>
              <div style={{ marginBottom: "20px" }}>
                <h1 style={{ fontSize: "24px", color: "#ffffff", fontWeight: 900, margin: 0 }}>⚙️ Authorized Profile & Settings</h1>
                <p style={{ color: "#94a3b8", fontSize: "13.5px", margin: "4px 0 0" }}>
                  Session details, database provider status, and access controls.
                </p>
              </div>

              <div style={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "12px", padding: "24px", maxWidth: "600px" }}>
                <div style={{ display: "grid", gap: "14px", fontSize: "14px" }}>
                  <div><span style={{ color: "#64748b" }}>Authenticated User:</span> <strong style={{ color: "#38bdf8" }}>{session.username}</strong></div>
                  <div><span style={{ color: "#64748b" }}>Assigned Role:</span> <strong style={{ color: "#fbbf24" }}>{session.role}</strong></div>
                  <div><span style={{ color: "#64748b" }}>Constituency Jurisdiction:</span> <strong style={{ color: "#f8fafc" }}>Srikalahasti Assembly No. 168</strong></div>
                  <div><span style={{ color: "#64748b" }}>Active Database Provider:</span> <strong style={{ color: "#34d399" }}>sqlite_file (Connected)</strong></div>
                  <div><span style={{ color: "#64748b" }}>Live Database Records:</span> <strong style={{ color: "#38bdf8" }}>{totalLive}</strong></div>
                  <div><span style={{ color: "#64748b" }}>Sample Presentation Records:</span> <strong style={{ color: "#c084fc" }}>{sampleComplaints.length}</strong></div>
                </div>

                <div style={{ borderTop: "1px solid #334155", marginTop: "20px", paddingTop: "16px" }}>
                  <a
                    href="/api/auth/logout"
                    style={{
                      display: "inline-block",
                      backgroundColor: "#ef4444",
                      color: "#ffffff",
                      padding: "8px 16px",
                      borderRadius: "6px",
                      textDecoration: "none",
                      fontWeight: 800,
                      fontSize: "13px",
                    }}
                  >
                    🚪 Sign Out of Workspace
                  </a>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Floating MLA Intelligence Assistant Chatbot */}
      <MLAChatbot />
    </div>
  );
}

// Subcomponents
function MetricCard({ title, value, color, subtext, danger }: { title: string; value: number; color: string; subtext: string; danger?: boolean }) {
  return (
    <div
      style={{
        backgroundColor: "#1e293b",
        padding: "18px",
        borderRadius: "10px",
        borderLeft: `4px solid ${color}`,
        border: danger ? "1px solid rgba(239, 68, 68, 0.4)" : "1px solid #334155",
      }}
    >
      <div style={{ color: "#94a3b8", fontSize: "12.5px", fontWeight: 600, marginBottom: "4px" }}>{title}</div>
      <div style={{ color: "#f8fafc", fontSize: "26px", fontWeight: 900 }}>{value}</div>
      <div style={{ color: "#64748b", fontSize: "11.5px", marginTop: "4px" }}>{subtext}</div>
    </div>
  );
}

function TabFilterLink({ active, href, label }: { active: boolean; href: string; label: string }) {
  return (
    <Link
      href={href}
      style={{
        padding: "6px 12px",
        color: active ? "#0f172a" : "#cbd5e1",
        backgroundColor: active ? "#fbbf24" : "transparent",
        borderRadius: "6px",
        textDecoration: "none",
        fontWeight: active ? 800 : 600,
        fontSize: "12.5px",
        border: active ? "1px solid #fbbf24" : "1px solid #334155",
      }}
    >
      {label}
    </Link>
  );
}

function EmptyStateMessage() {
  return (
    <div style={{ backgroundColor: "#1e293b", border: "1px dashed #334155", borderRadius: "12px", padding: "40px 20px", textAlign: "center", width: "100%" }}>
      <div style={{ fontSize: "28px", marginBottom: "8px" }}>🟢</div>
      <h3 style={{ color: "#f8fafc", margin: "0 0 6px", fontSize: "16px", fontWeight: 800 }}>No Complaints Found</h3>
      <p style={{ color: "#94a3b8", fontSize: "13.5px", margin: 0 }}>
        There are currently no live citizen complaints matching this filter. New citizen submissions via <code>/submit</code> will appear here automatically.
      </p>
    </div>
  );
}

function ComplaintsGrid({ complaints }: { complaints: any[] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "20px" }}>
      {complaints.map((c) => {
        const ai = c.aiAnalysis;
        const isEmergency = ai?.urgency === "Emergency" || ai?.urgency === "Critical" || ai?.urgency === "High" || ai?.safetyEscalationRequired;
        const mediaList: string[] = c.mediaUrls || [];

        return (
          <div
            key={c.id}
            style={{
              backgroundColor: "#1e293b",
              borderRadius: "12px",
              padding: "20px",
              border: isEmergency ? "2px solid #ef4444" : c.status === "Resolved" ? "1px solid #10b981" : "1px solid #334155",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              {/* Status & Urgency Badges */}
              <div style={{ display: "flex", gap: "6px", marginBottom: "12px", flexWrap: "wrap", alignItems: "center" }}>
                <span style={{ backgroundColor: "rgba(56,189,248,0.15)", color: "#38bdf8", border: "1px solid rgba(56,189,248,0.3)", padding: "2px 8px", borderRadius: "10px", fontSize: "11px", fontWeight: 800 }}>
                  {c.status}
                </span>
                <span style={{ backgroundColor: "rgba(16,185,129,0.15)", color: "#34d399", border: "1px solid rgba(16,185,129,0.3)", padding: "2px 8px", borderRadius: "10px", fontSize: "11px", fontWeight: 800 }}>
                  LIVE CITIZEN
                </span>
                {ai?.urgency && (
                  <span style={{ backgroundColor: isEmergency ? "rgba(239,68,68,0.15)" : "rgba(250,204,21,0.15)", color: isEmergency ? "#f87171" : "#facc15", border: "1px solid rgba(255,255,255,0.1)", padding: "2px 8px", borderRadius: "10px", fontSize: "11px", fontWeight: 800 }}>
                    Urgency: {ai.urgency}
                  </span>
                )}
              </div>

              {/* Title */}
              <h2 style={{ fontSize: "1.1rem", color: "#fbbf24", margin: "0 0 8px", lineHeight: "1.35", fontWeight: 800 }}>
                {ai?.title || (c.description ? c.description.slice(0, 65) + "..." : "Grievance Report")}
              </h2>

              <p style={{ fontSize: "0.85rem", color: "#cbd5e1", lineHeight: "1.5", marginBottom: "14px", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                {c.description}
              </p>

              {/* Attached Evidence Files Component with Clean Filename Formatting & Video Player */}
              <div style={{ backgroundColor: "rgba(15,23,42,0.8)", borderRadius: "8px", padding: "10px", marginBottom: "14px", border: "1px solid rgba(255,255,255,0.06)", fontSize: "0.8rem" }}>
                <div style={{ fontWeight: 800, color: "#38bdf8", marginBottom: "6px" }}>
                  📎 Attached Evidence Files ({mediaList.length})
                </div>

                {mediaList.length === 0 ? (
                  <span style={{ color: "#64748b", fontStyle: "italic" }}>No media files attached.</span>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {mediaList.map((url: string, idx: number) => {
                      const isImage = url.match(/\.(jpeg|jpg|png|webp|gif)/i);
                      const isVideo = url.match(/\.(mp4|webm|mov|avi|3gp|mkv)/i);
                      const isAudio = url.match(/\.(mp3|wav|ogg|m4a)/i);
                      const displayName = formatFileName(url, idx);

                      return (
                        <div
                          key={idx}
                          style={{
                            background: "rgba(30,41,59,0.9)",
                            padding: "8px 10px",
                            borderRadius: "6px",
                            border: "1px solid rgba(255,255,255,0.08)",
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px", marginBottom: isVideo || isImage || isAudio ? "6px" : "0" }}>
                            <span
                              style={{
                                color: "#f8fafc",
                                fontSize: "0.78rem",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                flex: 1,
                                minWidth: 0,
                                fontWeight: 700,
                              }}
                            >
                              {isImage ? "🖼️ Image" : isVideo ? "🎥 Video" : isAudio ? "🎵 Audio" : "📄 Document"}: {displayName}
                            </span>
                            <a
                              href={url}
                              target="_blank"
                              rel="noreferrer"
                              style={{ color: "#fbbf24", textDecoration: "none", fontWeight: "bold", fontSize: "0.75rem", flexShrink: 0 }}
                            >
                              Open File &rarr;
                            </a>
                          </div>

                          {isVideo && (
                            <video controls style={{ width: "100%", maxHeight: "180px", borderRadius: "6px", backgroundColor: "#000", marginTop: "4px" }}>
                              <source src={url} />
                              Your browser does not support HTML5 video streaming.
                            </video>
                          )}

                          {isImage && (
                            <img src={url} alt="Evidence" style={{ maxWidth: "100%", maxHeight: "160px", borderRadius: "6px", objectFit: "contain", marginTop: "4px" }} />
                          )}

                          {isAudio && (
                            <audio controls style={{ width: "100%", marginTop: "4px" }}>
                              <source src={url} />
                            </audio>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Case Metadata Panel */}
              <div style={{ backgroundColor: "rgba(15,23,42,0.6)", borderRadius: "8px", padding: "10px", marginBottom: "14px", fontSize: "0.8rem", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", marginBottom: "4px" }}>
                  <div><span style={{ color: "#64748b" }}>Case ID:</span> <strong style={{ color: "#38bdf8", fontFamily: "monospace" }}>{c.id}</strong></div>
                  <div><span style={{ color: "#64748b" }}>Mandal:</span> <strong style={{ color: "#f8fafc" }}>{c.mandal}</strong></div>
                </div>
                <div style={{ marginBottom: "4px" }}>
                  <span style={{ color: "#64748b" }}>Dept:</span> <strong style={{ color: "#f59e0b" }}>{c.assignedDepartment || c.department || ai?.department || "Unassigned"}</strong>
                </div>
                <div>
                  <span style={{ color: "#64748b" }}>Citizen Contact:</span>{" "}
                  {c.mobileNumber ? (
                    <span style={{ color: "#38bdf8", fontWeight: 800, fontFamily: "monospace", fontSize: "0.85rem" }}>
                      {c.mobileNumber}
                    </span>
                  ) : c.mobileNumberMasked ? (
                    <span style={{ color: "#fbbf24", fontWeight: 700, fontFamily: "monospace", fontSize: "0.85rem" }}>
                      {c.mobileNumberMasked}
                    </span>
                  ) : (
                    <span style={{ color: "#94a3b8", fontStyle: "italic" }}>Confidential / Anonymous</span>
                  )}
                </div>
                {c.mobileNumber && (
                  <div style={{ display: "flex", gap: "8px", marginTop: "6px" }}>
                    <a
                      href={`tel:${c.mobileNumber}`}
                      style={{
                        backgroundColor: "#10b981",
                        color: "#000000",
                        padding: "3px 10px",
                        borderRadius: "4px",
                        textDecoration: "none",
                        fontWeight: 800,
                        fontSize: "0.75rem",
                      }}
                    >
                      📞 Call Citizen
                    </a>
                    <a
                      href={`https://wa.me/${c.mobileNumber.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        backgroundColor: "#25d366",
                        color: "#000000",
                        padding: "3px 10px",
                        borderRadius: "4px",
                        textDecoration: "none",
                        fontWeight: 800,
                        fontSize: "0.75rem",
                      }}
                    >
                      💬 WhatsApp Update
                    </a>
                  </div>
                )}
                {ai?.recommendedAction && (
                  <div style={{ color: "#94a3b8", marginTop: "6px", fontSize: "0.76rem", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "6px", lineHeight: 1.4 }}>
                    💡 <strong>Legal Directive:</strong> {ai.recommendedAction}
                  </div>
                )}
              </div>
            </div>

            {/* Protected Case Detail Link */}
            <Link
              href={`/mla/complaint/${c.id}`}
              style={{
                display: "block",
                textAlign: "center",
                backgroundColor: "#fbbf24",
                color: "#0f172a",
                padding: "9px 14px",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: 800,
                fontSize: "13px",
              }}
            >
              Inspect Full Case & Action Log &rarr;
            </Link>
          </div>
        );
      })}
    </div>
  );
}
