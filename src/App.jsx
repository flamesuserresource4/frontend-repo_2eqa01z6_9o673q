import React, { useState } from 'react';
import ImageAnalyzer from './components/ImageAnalyzer.jsx';
import ScoreAndPreview from './components/ScoreAndPreview.jsx';
import Recommendations from './components/Recommendations.jsx';
import PlanScheduler from './components/PlanScheduler.jsx';

export default function App() {
  const [analysis, setAnalysis] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-indigo-50">
      <header className="sticky top-0 z-20 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg">
              <span className="text-lg font-bold">FS</span>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">FaceSenate</h1>
              <p className="text-xs text-gray-500">Analyze • Improve • Plan</p>
            </div>
          </div>
          <a
            href="#"
            className="hidden items-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm text-gray-700 shadow-sm transition hover:bg-gray-50 md:inline-flex"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 11 3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
            How it works
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <section className="mb-8 rounded-2xl border border-indigo-100 bg-white p-6 shadow-sm">
          <div className="grid items-start gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Analyze your photo</h2>
              <p className="mt-1 text-sm text-gray-600">Get a visual score, tailored suggestions, and an instant improvement preview.</p>
              <div className="mt-4"><ImageAnalyzer onAnalyzed={setAnalysis} /></div>
            </div>
            <ScoreAndPreview analysis={analysis} />
          </div>
        </section>

        <section className="mb-8">
          <Recommendations analysis={analysis} />
        </section>

        <section className="mb-20">
          <PlanScheduler analysis={analysis} />
        </section>

        <footer className="py-8 text-center text-xs text-gray-500">
          For guidance only. This experience runs locally in your browser.
        </footer>
      </main>
    </div>
  );
}
