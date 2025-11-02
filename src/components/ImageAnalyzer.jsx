import React, { useRef, useState } from 'react';

function getImageData(img) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const maxSide = 300;
  const scale = Math.min(maxSide / img.width, maxSide / img.height, 1);
  canvas.width = Math.max(1, Math.floor(img.width * scale));
  canvas.height = Math.max(1, Math.floor(img.height * scale));
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

function analyzePixels(imageData) {
  const { data, width, height } = imageData;
  let total = 0;
  let sumBrightness = 0;
  let sumContrast = 0;

  // Simple left/right symmetry approximation
  let diffSum = 0;
  const half = Math.floor(width / 2);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const brightness = (r + g + b) / 3;
      sumBrightness += brightness;
      total++;
    }
  }
  const meanBrightness = sumBrightness / total;

  // Contrast as average absolute deviation
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const brightness = (r + g + b) / 3;
      sumContrast += Math.abs(brightness - meanBrightness);
    }
  }
  const contrast = sumContrast / total; // 0..255

  // Symmetry (compare mirrored pixels)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < half; x++) {
      const idxL = (y * width + x) * 4;
      const idxR = (y * width + (width - 1 - x)) * 4;
      const l = (data[idxL] + data[idxL + 1] + data[idxL + 2]) / 3;
      const r = (data[idxR] + data[idxR + 1] + data[idxR + 2]) / 3;
      diffSum += Math.abs(l - r);
    }
  }
  const symmetryScore = 1 - diffSum / (half * height * 255);

  // Normalize to 0..100
  const brightnessScore = Math.max(0, Math.min(100, (meanBrightness / 255) * 100));
  const contrastScore = Math.max(0, Math.min(100, (contrast / 128) * 100));
  const symmetryPct = Math.max(0, Math.min(100, symmetryScore * 100));

  const aestheticScore = Math.round(
    0.35 * brightnessScore + 0.35 * contrastScore + 0.3 * symmetryPct
  );

  return {
    brightness: Math.round(brightnessScore),
    contrast: Math.round(contrastScore),
    symmetry: Math.round(symmetryPct),
    score: aestheticScore,
  };
}

function buildRecommendations(metrics) {
  const tips = [];
  const products = [];

  if (metrics.brightness < 45) {
    tips.push('Improve lighting: face a window or use a soft key light.');
    products.push({ name: 'Ring Light (10-inch)', category: 'Lighting' });
  } else if (metrics.brightness > 75) {
    tips.push('Reduce overexposure: step back or diffuse light with a sheer curtain.');
    products.push({ name: 'Light Diffuser Panel', category: 'Lighting' });
  }

  if (metrics.contrast < 45) {
    tips.push('Increase contrast: adjust camera settings or shoot against a cleaner background.');
    products.push({ name: 'Matte Backdrop (Neutral Gray)', category: 'Setup' });
  }

  if (metrics.symmetry < 60) {
    tips.push('Try a straight-on angle and level the camera at eye height for balance.');
    products.push({ name: 'Adjustable Tripod', category: 'Stabilization' });
  }

  tips.push('Relax your facial muscles and add a gentle smile to enhance approachability.');
  products.push({ name: 'Hydrating Facial Mist', category: 'Skincare' });

  // Suggested preview filters for the "after" look
  const filters = {
    brightness: metrics.brightness < 60 ? 1.08 : 1,
    contrast: metrics.contrast < 60 ? 1.1 : 1.02,
    saturate: 1.06,
    blur: 0,
  };

  return { tips, products, filters };
}

export default function ImageAnalyzer({ onAnalyzed }) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFile = async (file) => {
    setError(null);
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    setLoading(true);
    try {
      const img = new Image();
      img.onload = () => {
        try {
          const imageData = getImageData(img);
          const metrics = analyzePixels(imageData);
          const recs = buildRecommendations(metrics);
          onAnalyzed({
            score: metrics.score,
            metrics,
            tips: recs.tips,
            products: recs.products,
            filters: recs.filters,
            imageSrc: url,
          });
        } catch (e) {
          console.error(e);
          setError('Could not analyze image. Try a different photo.');
        } finally {
          setLoading(false);
        }
      };
      img.onerror = () => {
        setLoading(false);
        setError('Invalid image file.');
      };
      img.src = url;
    } catch (e) {
      setLoading(false);
      setError('Something went wrong while reading the file.');
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
          Upload Photo
        </button>
        {loading ? (
          <span className="text-sm text-gray-500">Analyzing…</span>
        ) : preview ? (
          <span className="text-sm text-gray-500">Ready</span>
        ) : (
          <span className="text-sm text-gray-500">No photo selected</span>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {error && (
        <div className="mt-3 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}

      {preview && (
        <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 shadow-sm">
          <img src={preview} alt="preview" className="block w-full object-cover max-h-80" />
        </div>
      )}
      <p className="mt-3 text-xs text-gray-500">Your photo stays in your browser for analysis.</p>
    </div>
  );
}
