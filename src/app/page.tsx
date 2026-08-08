import Link from "next/link";
import { leadershipConfig } from "@/config/leadership";

export default function Home() {
  const isDemo = leadershipConfig.mode === "mla-demo";

  return (
    <main className="min-h-screen flex flex-col bg-navy-dark text-slate-100">
      {/* Header/Nav */}
      <header className="w-full py-6 px-8 border-b border-navy-light flex justify-between items-center">
        <div className="font-bold text-2xl tracking-wide text-saffron">
          Srikalahasti Praja Seva
        </div>
        <nav className="space-x-6 text-sm font-medium">
          <Link href="/submit" className="hover:text-saffron transition-colors">Report Issue</Link>
          <Link href="/dashboard" className="hover:text-saffron transition-colors">Constituency Insights</Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 bg-gradient-to-b from-navy to-navy-dark">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight text-white drop-shadow-lg">
          A Smarter Voice for Every Citizen of <span className="text-saffron">Srikalahasti</span>
        </h1>
        <p className="max-w-2xl text-lg md:text-xl text-slate-300 mb-10 leading-relaxed text-balance">
          A secure, AI-assisted platform that helps citizens report public-service issues and helps constituency representatives identify patterns, prioritize urgent cases, and coordinate responsible action.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/submit" className="px-8 py-4 bg-saffron hover:bg-saffron-light text-navy-dark font-bold rounded-full shadow-xl transition-transform transform hover:scale-105">
            Submit a Grievance
          </Link>
          <Link href="/dashboard" className="px-8 py-4 bg-navy-light hover:bg-navy text-white font-bold rounded-full border border-saffron/30 transition-transform transform hover:scale-105">
            View Constituency Insights
          </Link>
        </div>
      </section>

      {/* MLA Demonstration Sections */}
      {isDemo && (
        <>
          {/* Leadership Vision */}
          <section className="py-24 px-6 max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-6 text-saffron">Technology in Service of Public Responsibility</h2>
              <p className="text-slate-300 text-lg leading-relaxed mb-6">
                The platform is designed to support the elected representative by converting citizen complaints into structured, reviewable, and department-oriented information.
              </p>
              <div className="bg-navy p-6 rounded-xl border border-navy-light inline-block">
                <h3 className="font-bold text-xl text-white">{leadershipConfig.currentRepresentative.name}</h3>
                <p className="text-saffron-light">{leadershipConfig.currentRepresentative.title}</p>
                <p className="text-sm text-slate-400 mt-2">{leadershipConfig.currentRepresentative.party}</p>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              {/* Placeholder for MLA Portrait */}
              <div className="w-72 h-96 bg-navy-light rounded-2xl border-4 border-saffron flex items-center justify-center text-slate-400">
                [Portrait: {leadershipConfig.currentRepresentative.name}]
              </div>
            </div>
          </section>

          {/* Legacy Section */}
          {leadershipConfig.currentRepresentative.father && (
            <section className="py-24 px-6 bg-navy max-w-7xl mx-auto rounded-3xl mb-24 border border-navy-light flex flex-col items-center text-center">
              <h2 className="text-3xl font-bold mb-6 text-saffron-light">A Legacy of Public Leadership</h2>
              <p className="max-w-3xl text-lg text-slate-300 mb-10 leading-relaxed">
                {leadershipConfig.currentRepresentative.father.legacyText}
              </p>
              <div className="w-48 h-48 rounded-full border-4 border-saffron overflow-hidden bg-navy-dark flex items-center justify-center text-sm text-slate-400">
                [Portrait: {leadershipConfig.currentRepresentative.father.name}]
              </div>
            </section>
          )}
        </>
      )}

      {/* AI Workflow Section */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-16 text-white">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-8 text-center">
          <div className="p-6 bg-navy rounded-xl border border-navy-light">
            <div className="text-saffron text-4xl mb-4">1</div>
            <h3 className="font-bold mb-2">Citizen Submits</h3>
            <p className="text-sm text-slate-400">Securely submit issue via text, audio, or image.</p>
          </div>
          <div className="p-6 bg-navy rounded-xl border border-navy-light">
            <div className="text-saffron text-4xl mb-4">2</div>
            <h3 className="font-bold mb-2">AI Processing</h3>
            <p className="text-sm text-slate-400">LLM structures and classifies the complaint into intelligence.</p>
          </div>
          <div className="p-6 bg-navy rounded-xl border border-navy-light">
            <div className="text-saffron text-4xl mb-4">3</div>
            <h3 className="font-bold mb-2">Human Review</h3>
            <p className="text-sm text-slate-400">Preliminary indicators are checked and verified by staff.</p>
          </div>
          <div className="p-6 bg-navy rounded-xl border border-navy-light">
            <div className="text-saffron text-4xl mb-4">4</div>
            <h3 className="font-bold mb-2">Action & Routing</h3>
            <p className="text-sm text-slate-400">Forwarded to the responsible department for resolution.</p>
          </div>
        </div>
        <p className="text-center mt-12 text-sm text-saffron-light">
          * AI assists analysis. Humans and competent authorities make decisions.
        </p>
      </section>

      {/* Footer */}
      <footer className="w-full bg-black py-12 px-8 mt-auto border-t border-navy">
        <div className="max-w-6xl mx-auto text-xs text-slate-500 leading-relaxed">
          <p className="mb-4">
            This platform is a proposed civic-technology concept and is not an official government website unless formally authorized.
            AI-generated outputs are preliminary assessments only. They do not establish the truth of an allegation, determine guilt, 
            replace investigation, or replace judicial/legal processes.
          </p>
          <p>
            Political photographs, party names, logos and symbols are used here for demonstration purposes only. Citizen data and 
            uploaded evidence must be handled according to applicable privacy, cyber-security, and data-protection requirements.
          </p>
        </div>
      </footer>
    </main>
  );
}
