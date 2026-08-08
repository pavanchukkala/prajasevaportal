import Link from "next/link";
import { leadershipConfig } from "@/config/leadership";
import { geographyConfig } from "@/config/geography";

export default function Dashboard() {
  const isDemo = leadershipConfig.mode === "mla-demo";

  // Mock complaints showing AI predictions
  const mockComplaints = [
    {
      id: "SKT-2026-00142",
      title: "Possible delay in issuing a welfare certificate at a village secretariat",
      category: "Welfare",
      dept: "Revenue",
      location: "Yerpedu Mandal",
      urgency: "Priority",
      credibility: "Medium",
      confidence: "87%",
      date: "2026-08-07",
    },
    {
      id: "SKT-2026-00143",
      title: "Drinking water pipeline leak affecting 50 households",
      category: "Infrastructure",
      dept: "Municipal Administration",
      location: "Srikalahasti Ward 12",
      urgency: "High",
      credibility: "High",
      confidence: "94%",
      date: "2026-08-08",
    },
    {
      id: "SKT-2026-00144",
      title: "Alleged bribery request for land mutation",
      category: "Corruption",
      dept: "Registration & Stamps",
      location: "Thottambedu Mandal",
      urgency: "High",
      credibility: "Low", // Contradiction flags exist
      confidence: "65%",
      date: "2026-08-08",
    }
  ];

  return (
    <main className="min-h-screen bg-navy-dark text-slate-100 flex flex-col">
      {/* Header */}
      <header className="bg-navy border-b border-navy-light px-8 py-4 flex justify-between items-center sticky top-0 z-50">
        <div>
          <h1 className="text-xl font-bold text-saffron">Constituency Command Center</h1>
          <p className="text-xs text-slate-400">Srikalahasti Assembly Constituency (No. {geographyConfig.constituency.number})</p>
        </div>
        <nav className="flex items-center gap-4">
          <Link href="/" className="text-sm hover:text-saffron transition-colors">Home</Link>
          <Link href="/submit" className="text-sm px-4 py-2 bg-saffron text-navy-dark font-bold rounded-lg hover:bg-saffron-light">New Case</Link>
        </nav>
      </header>

      {/* Welcome Banner (Leadership) */}
      {isDemo && (
        <div className="bg-gradient-to-r from-navy to-navy-light p-8 border-b border-navy-light shadow-inner flex items-center gap-6">
          <div className="w-16 h-16 rounded-full border-2 border-saffron flex items-center justify-center overflow-hidden bg-navy-dark text-[10px] text-slate-500 text-center">
            [Portrait]
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Welcome, {leadershipConfig.currentRepresentative.name}</h2>
            <p className="text-saffron-light text-sm">{leadershipConfig.currentRepresentative.title}</p>
          </div>
        </div>
      )}

      <div className="flex-1 p-8 max-w-7xl mx-auto w-full grid lg:grid-cols-3 gap-8">
        
        {/* Left Column: Stats & Geography */}
        <div className="space-y-8 lg:col-span-1">
          {/* Quick Stats */}
          <section className="bg-navy rounded-2xl p-6 border border-navy-light shadow-lg">
            <h3 className="text-lg font-bold text-white mb-4">Live Overview</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-navy-dark p-4 rounded-xl border border-navy-light text-center">
                <div className="text-3xl font-bold text-saffron">142</div>
                <div className="text-xs text-slate-400 mt-1">Total Cases</div>
              </div>
              <div className="bg-navy-dark p-4 rounded-xl border border-navy-light text-center">
                <div className="text-3xl font-bold text-red-400">12</div>
                <div className="text-xs text-slate-400 mt-1">High Priority</div>
              </div>
              <div className="bg-navy-dark p-4 rounded-xl border border-navy-light text-center">
                <div className="text-3xl font-bold text-blue-400">89</div>
                <div className="text-xs text-slate-400 mt-1">Under Review</div>
              </div>
              <div className="bg-navy-dark p-4 rounded-xl border border-navy-light text-center">
                <div className="text-3xl font-bold text-green-400">41</div>
                <div className="text-xs text-slate-400 mt-1">Resolved</div>
              </div>
            </div>
          </section>

          {/* Context Info */}
          <section className="bg-navy rounded-2xl p-6 border border-navy-light shadow-lg">
            <h3 className="text-lg font-bold text-white mb-4">Constituency Context</h3>
            <ul className="text-sm space-y-3 text-slate-300">
              <li className="flex justify-between border-b border-navy-light pb-2">
                <span>Mandals</span>
                <span className="font-bold text-white">4</span>
              </li>
              <li className="flex justify-between border-b border-navy-light pb-2">
                <span>Population Base (2011)</span>
                <span className="font-bold text-white">{geographyConfig.constituency.baselinePopulation.toLocaleString()}</span>
              </li>
              <li className="flex justify-between border-b border-navy-light pb-2">
                <span>Est. Service Personnel</span>
                <span className="font-bold text-white">{geographyConfig.workforceEstimate.min} - {geographyConfig.workforceEstimate.max}</span>
              </li>
            </ul>
            <p className="text-[10px] text-slate-500 mt-4 leading-tight">
              {geographyConfig.constituency.populationDisclaimer} <br/>
              {geographyConfig.workforceEstimate.disclaimer}
            </p>
          </section>

          {/* Department Heatmap */}
          <section className="bg-navy rounded-2xl p-6 border border-navy-light shadow-lg">
            <h3 className="text-lg font-bold text-white mb-4">Department Heatmap</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-300">Revenue</span>
                <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-xs font-bold">42 Cases</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-300">Municipality</span>
                <span className="bg-orange-500/20 text-orange-400 px-2 py-1 rounded text-xs font-bold">34 Cases</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-300">Police</span>
                <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded text-xs font-bold">21 Cases</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-300">Health</span>
                <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs font-bold">18 Cases</span>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: AI Insights & Feed */}
        <div className="space-y-8 lg:col-span-2">
          
          <div className="bg-blue-900/30 border border-blue-500/30 rounded-xl p-4 flex gap-4 items-start">
            <div className="text-blue-400 text-xl mt-1">ℹ️</div>
            <div className="text-sm text-slate-300 leading-relaxed">
              <strong className="text-blue-400 block mb-1">AI-Generated Preliminary Assessments</strong>
              The insights below are generated by an LLM based on unstructured citizen evidence. This is not a finding of fact, a legal conclusion, or a determination of guilt. It is a prioritization tool to assist human review.
            </div>
          </div>

          <section className="bg-navy rounded-2xl border border-navy-light shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-navy-light flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">Recent AI Case Intelligence</h3>
              <button className="text-xs text-saffron hover:text-white transition-colors">View All &rarr;</button>
            </div>
            
            <div className="divide-y divide-navy-light">
              {mockComplaints.map(c => (
                <div key={c.id} className="p-6 hover:bg-navy-dark transition-colors group cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-md font-bold text-white group-hover:text-saffron transition-colors">{c.title}</h4>
                    <span className="text-xs text-slate-500 whitespace-nowrap ml-4">{c.date}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-2 py-1 bg-navy-light text-slate-300 rounded text-xs">{c.id}</span>
                    <span className="px-2 py-1 bg-navy-light text-slate-300 rounded text-xs">{c.dept}</span>
                    <span className="px-2 py-1 bg-navy-light text-slate-300 rounded text-xs">{c.location}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 p-4 bg-navy-dark rounded-xl border border-navy-light/50">
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">AI Credibility</div>
                      <div className={`text-sm font-bold ${c.credibility === 'High' ? 'text-green-400' : c.credibility === 'Medium' ? 'text-yellow-400' : 'text-red-400'}`}>
                        {c.credibility} ({c.confidence})
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Urgency</div>
                      <div className={`text-sm font-bold ${c.urgency === 'High' ? 'text-red-400' : 'text-orange-400'}`}>
                        {c.urgency}
                      </div>
                    </div>
                    <div className="flex items-center justify-end">
                      <Link href={`/complaint/${c.id}`} className="text-xs font-bold text-saffron border border-saffron px-3 py-1 rounded hover:bg-saffron hover:text-navy-dark transition-colors">
                        Review Case
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>

      </div>
    </main>
  );
}
