import React from 'react';

export default function ScoreAndPreview({ analysis }) {
  const score = analysis?.score ?? 0;
  const filters = analysis?.filters || { brightness: 1, contrast: 1, saturate: 1, blur: 0 };
  const filterStyle = `brightness(${filters.brightness}) contrast(${filters.contrast}) saturate(${filters.saturate}) blur(${filters.blur}px)`;

  return (
    <div className="w-full">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Your Aesthetic Score</h3>
            <p className="text-sm text-gray-500">Based on lighting, contrast and balance</p>
          </div>
          <div className="relative h-16 w-16">
            <svg viewBox="0 0 36 36" className="h-16 w-16">
              <path className="text-gray-200" stroke="currentColor" strokeWidth="4" fill="none" d="M18 2a16 16 0 1 1 0 32 16 16 0 0 1 0-32" />
              <path className="text-indigo-600" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round"
                d={describeArc(18,18,16,0,Math.min(359.9,(score/100)*360))} />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-lg font-bold">{score}</div>
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <div className="mb-2 text-sm font-medium">Original</div>
            <div className="overflow-hidden rounded-xl border">
              {analysis?.imageSrc ? (
                <img src={analysis.imageSrc} alt="original" className="block w-full object-cover max-h-72" />
              ) : (
                <div className="flex h-48 items-center justify-center text-sm text-gray-400">Upload a photo to see results</div>
              )}
            </div>
          </div>
          <div>
            <div className="mb-2 text-sm font-medium">After Suggestions</div>
            <div className="overflow-hidden rounded-xl border">
              {analysis?.imageSrc ? (
                <img
                  src={analysis.imageSrc}
                  alt="after"
                  className="block w-full object-cover max-h-72"
                  style={{ filter: filterStyle }}
                />
              ) : (
                <div className="flex h-48 items-center justify-center text-sm text-gray-400">Preview will appear here</div>
              )}
            </div>
          </div>
        </div>

        {analysis && (
          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            <Metric label="Lighting" value={analysis.metrics.brightness} />
            <Metric label="Contrast" value={analysis.metrics.contrast} />
            <Metric label="Balance" value={analysis.metrics.symmetry} />
          </div>
        )}
      </div>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-lg bg-gray-50 p-3">
      <div className="text-2xl font-bold text-gray-900">{value ?? 0}</div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  );
}

// Utility to draw arc path for circular progress
function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  var angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}
function describeArc(x, y, radius, startAngle, endAngle) {
  var start = polarToCartesian(x, y, radius, endAngle);
  var end = polarToCartesian(x, y, radius, startAngle);
  var largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  var d = [
    'M', start.x, start.y,
    'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y,
  ].join(' ');
  return d;
}
