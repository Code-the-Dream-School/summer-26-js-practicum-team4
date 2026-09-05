import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import PatternCanvas from "./PatternCanvas";
import PatternLegend from "./PatternLegend";

import generateImgBlob from "../../../services/generateImgBlob";
import { useAuth } from "../../../state/auth/useAuth";

const ZOOM_LEVELS = [
  { label: "50%", cellSize: 8 },
  { label: "75%", cellSize: 12 },
  { label: "100%", cellSize: 16 },
  { label: "125%", cellSize: 20 },
  { label: "150%", cellSize: 24 },
];

function PatternResult({
  pattern,
  previewUrl,
  fileName,
  canvasRef,
  onBack,
  onUploadNew,
}) {
  const [zoomIndex, setZoomIndex] = useState(2);
  const [imgBlob, setImgBlob] = useState(null);

  // Zoom Controls
  const zoom = ZOOM_LEVELS[zoomIndex];
  const zoomOut = () => {
    setZoomIndex((current) => Math.max(0, current - 1));
  };

  const zoomIn = () => {
    setZoomIndex((current) => Math.min(ZOOM_LEVELS.length - 1, current + 1));
  };

  const totalStitches = pattern.width * pattern.height;

  // Creating Image
  useEffect(() => {
    async function createPatternPng() {
      generateImgBlob(canvasRef, setImgBlob);
      return;
    }

    createPatternPng();
  }, [canvasRef]);

  function createPatternPng() {
    let patternImg = <div></div>;

    if (imgBlob) {
      const patternImgSrc = URL.createObjectURL(imgBlob);
      patternImg = (
        <img
          src={patternImgSrc}
          className="hidden print:block max-h-[75dvh] break-after-page"
        />
      );
    }
    console.log(patternImg);
    return patternImg;
  }

  return (
    <main className="min-h-screen bg-background px-4 py-8 lg:px-8">
      <div className="mx-auto max-w-[1600px] space-y-6">
        <header className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between md:p-7 print:hidden">
          <div>
            <p className="mb-1 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Pattern ready
            </p>
            <h1 className="text-3xl font-bold text-secondary md:text-4xl">
              Your Cross-Stitch Pattern
            </h1>
            <p className="mt-2 text-text-secondary">
              {pattern.width} × {pattern.height} stitches ·{" "}
              {totalStitches.toLocaleString()} total · {pattern.palette.length}{" "}
              DMC colors
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:items-end">
            <button
              type="button"
              onClick={onBack}
              className="rounded-lg bg-secondary px-5 py-2.5 font-semibold text-white transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent"
            >
              Back to Generator
            </button>
            <button
              type="button"
              onClick={onUploadNew}
              className="rounded-lg border border-border bg-surface px-5 py-2.5 font-semibold text-secondary transition hover:bg-background focus:outline-none focus:ring-2 focus:ring-accent"
            >
              Upload New Image
            </button>
          </div>
        </header>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
          <section className="canvas-object min-w-0 rounded-2xl border border-border bg-surface p-4 shadow-sm md:p-6">
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-secondary">
                  Stitch Chart
                </h2>
                <p className="text-sm text-text-secondary">
                  Scroll to explore larger patterns.
                </p>
              </div>
              <p className="text-sm text-text-secondary">
                Darker lines mark every 10 stitches.
              </p>
            </div>

            <PatternCanvas
              pattern={pattern}
              cellSize={zoom.cellSize}
              canvasRef={canvasRef}
            />

            {createPatternPng()}
          </section>

          <aside className="space-y-5">
            <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm print: hidden">
              <h2 className="mb-3 text-xl font-semibold text-secondary">
                Original Image
              </h2>
              <img
                src={previewUrl}
                alt={`Original upload: ${fileName}`}
                className="max-h-64 w-full rounded-lg border border-border object-contain"
              />
              <p className="mt-2 break-all text-sm text-text-secondary">
                {fileName}
              </p>
            </section>

            <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
              <h2 className="mb-3 text-xl font-semibold text-secondary">
                Pattern Details
              </h2>
              <dl className="space-y-3">
                <div className="flex justify-between gap-4 border-b border-border pb-2">
                  <dt className="text-text-secondary">Dimensions</dt>
                  <dd className="font-semibold text-secondary">
                    {pattern.width} × {pattern.height}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-border pb-2">
                  <dt className="text-text-secondary">Total stitches</dt>
                  <dd className="font-semibold text-secondary">
                    {totalStitches.toLocaleString()}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-text-secondary">DMC colors</dt>
                  <dd className="font-semibold text-secondary">
                    {pattern.palette.length}
                  </dd>
                </div>
              </dl>
            </section>

            <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm print:hidden">
              <h2 className="mb-3 text-xl font-semibold text-secondary">
                Zoom
              </h2>
              <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2">
                <button
                  type="button"
                  onClick={zoomOut}
                  disabled={zoomIndex === 0}
                  aria-label="Zoom out"
                  className="h-10 w-10 rounded-lg border border-border bg-surface text-xl font-bold text-secondary transition hover:bg-background focus:outline-none focus:ring-2 focus:ring-accent disabled:cursor-not-allowed disabled:opacity-40"
                >
                  −
                </button>
                <output className="text-center font-semibold text-secondary">
                  {zoom.label}
                </output>
                <button
                  type="button"
                  onClick={zoomIn}
                  disabled={zoomIndex === ZOOM_LEVELS.length - 1}
                  aria-label="Zoom in"
                  className="h-10 w-10 rounded-lg border border-border bg-surface text-xl font-bold text-secondary transition hover:bg-background focus:outline-none focus:ring-2 focus:ring-accent disabled:cursor-not-allowed disabled:opacity-40"
                >
                  +
                </button>
              </div>
              <button
                type="button"
                onClick={() => setZoomIndex(2)}
                disabled={zoomIndex === 2}
                className="mt-3 w-full rounded-lg border border-border px-4 py-2 text-sm font-semibold text-secondary transition hover:bg-background focus:outline-none focus:ring-2 focus:ring-accent disabled:cursor-not-allowed disabled:opacity-40"
              >
                Reset Zoom
              </button>
            </section>
          </aside>
        </div>

        <PatternLegend palette={pattern.palette} grid={pattern.grid} />
      </div>
    </main>
  );
}

const colorShape = PropTypes.shape({
  dmcCode: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  r: PropTypes.number.isRequired,
  g: PropTypes.number.isRequired,
  b: PropTypes.number.isRequired,
  symbol: PropTypes.string.isRequired,
});

PatternResult.propTypes = {
  pattern: PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    palette: PropTypes.arrayOf(colorShape).isRequired,
    grid: PropTypes.arrayOf(PropTypes.number).isRequired,
  }).isRequired,
  previewUrl: PropTypes.string.isRequired,
  fileName: PropTypes.string.isRequired,
  canvasRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  onBack: PropTypes.func.isRequired,
  onUploadNew: PropTypes.func.isRequired,
};

export default PatternResult;
