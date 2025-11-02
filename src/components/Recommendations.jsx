import React from 'react';

export default function Recommendations({ analysis }) {
  const tips = analysis?.tips || [];
  const products = analysis?.products || [];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Personalized Recommendations</h3>
          <p className="text-sm text-gray-500">Actionable steps to elevate your look</p>
        </div>
      </div>

      {tips.length === 0 ? (
        <div className="text-sm text-gray-500">Upload a photo to receive tailored suggestions.</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h4 className="mb-2 text-sm font-medium text-gray-700">Improvement Tips</h4>
            <ul className="space-y-2">
              {tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 rounded-lg bg-indigo-50 p-3 text-sm text-indigo-900">
                  <svg xmlns="http://www.w3.org/2000/svg" className="mt-0.5 h-4 w-4 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 11 3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-2 text-sm font-medium text-gray-700">Suggested Products</h4>
            <ul className="space-y-2">
              {products.map((p, i) => (
                <li key={i} className="flex items-center justify-between rounded-lg border p-3 text-sm">
                  <div>
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs text-gray-500">{p.category}</div>
                  </div>
                  <a
                    href={`https://www.google.com/search?q=${encodeURIComponent(p.name)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-600 hover:underline"
                  >
                    View
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
