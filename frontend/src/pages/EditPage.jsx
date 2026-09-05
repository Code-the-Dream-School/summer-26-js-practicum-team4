import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import PatternCanvas from "../components/features/pattern/PatternCanvas";
import PatternLegend from "../components/features/pattern/PatternLegend";

import { fetchPattern, updatePattern } from "../services/patternService";

const ZOOM_LEVELS = [
  { label: "50%", cellSize: 8 },
  { label: "75%", cellSize: 12 },
  { label: "100%", cellSize: 16 },
  { label: "125%", cellSize: 20 },
  { label: "150%", cellSize: 24 },
];

function EditPage() {
  const { patternId } = useParams();

  const [pattern, setPattern] = useState(null);

  const [nameDraft, setNameDraft] = useState("");
  const [widthDraft, setWidthDraft] = useState("");
  const [heightDraft, setHeightDraft] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [zoomIndex, setZoomIndex] = useState(2);
  const [errorMessage, setErrorMessage] = useState("");

  const zoom = ZOOM_LEVELS[zoomIndex];

  useEffect(() => {
    async function loadPattern() {
      try {
        const fetchedPattern = await fetchPattern(patternId);

        setPattern(fetchedPattern);
        setNameDraft(fetchedPattern.patternName);
        setWidthDraft(String(fetchedPattern.stitchWidth));
        setHeightDraft(String(fetchedPattern.stitchHeight));
      } catch {
        setErrorMessage("Unable to load pattern.");
      }
    }

    loadPattern();
  }, [patternId]);

  const handleStartEdit = () => {
    setNameDraft(pattern.patternName);
    setWidthDraft(String(pattern.stitchWidth));
    setHeightDraft(String(pattern.stitchHeight));
    setErrorMessage("");
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setNameDraft(pattern.patternName);
    setWidthDraft(String(pattern.stitchWidth));
    setHeightDraft(String(pattern.stitchHeight));
    setErrorMessage("");
    setIsEditing(false);
  };

  const handleSaveChanges = async () => {
    const name = nameDraft.trim();
    const width = Number(widthDraft);
    const height = Number(heightDraft);

    if (!name) {
      setErrorMessage("Pattern name cannot be empty.");
      return;
    }

    if (
      !Number.isInteger(width) ||
      !Number.isInteger(height) ||
      width < 10 ||
      width > 200 ||
      height < 10 ||
      height > 200
    ) {
      setErrorMessage("Width and height must be integers between 10 and 200.");
      return;
    }

    try {
      setIsSaving(true);
      setErrorMessage("");

      const updatedPattern = await updatePattern(pattern.id, {
        patternName: name,
        stitchWidth: width,
        stitchHeight: height,
      });

      if (updatedPattern?.message) {
        setErrorMessage(updatedPattern.message);
        return;
      }

      setPattern(updatedPattern);

      setNameDraft(updatedPattern.patternName);
      setWidthDraft(String(updatedPattern.stitchWidth));
      setHeightDraft(String(updatedPattern.stitchHeight));

      setIsEditing(false);
    } catch {
      setErrorMessage("Unable to update pattern.");
    } finally {
      setIsSaving(false);
    }
  };

  const zoomOut = () => {
    setZoomIndex((current) => Math.max(0, current - 1));
  };

  const zoomIn = () => {
    setZoomIndex((current) => Math.min(ZOOM_LEVELS.length - 1, current + 1));
  };

  if (!pattern) {
    return (
      <main className="min-h-screen bg-background p-8">
        {errorMessage ? (
          <p className="text-text-secondary">{errorMessage}</p>
        ) : (
          <p className="text-text-secondary">Loading...</p>
        )}
      </main>
    );
  }

  const totalStitches = pattern.stitchWidth * pattern.stitchHeight;

  const patternForCanvas = {
    width: pattern.stitchWidth,
    height: pattern.stitchHeight,
    palette: pattern.palette,
    grid: pattern.grid,
  };

  return (
    <main className="min-h-screen bg-background px-4 py-8 lg:px-8">
      <div className="mx-auto max-w-[1600px] space-y-6">
        <header className="rounded-2xl border border-border bg-surface p-5 shadow-sm md:p-7">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <p className="mb-1 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                Edit Pattern
              </p>

              {isEditing ? (
                <input
                  type="text"
                  value={nameDraft}
                  onChange={(event) => setNameDraft(event.target.value)}
                  autoFocus
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-3xl font-bold text-secondary outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 md:text-4xl"
                />
              ) : (
                <h1 className="text-3xl font-bold text-secondary md:text-4xl">
                  {pattern.patternName}
                </h1>
              )}

              <p className="mt-2 text-text-secondary">
                {pattern.stitchWidth} × {pattern.stitchHeight} stitches ·{" "}
                {totalStitches.toLocaleString()} total ·{" "}
                {pattern.palette.length} DMC colors
              </p>
            </div>

            <div className="flex shrink-0 gap-2">
              {isEditing ? (
                <>
                  <button
                    type="button"
                    onClick={handleSaveChanges}
                    disabled={isSaving}
                    className="rounded-lg bg-secondary px-5 py-2.5 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>

                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    disabled={isSaving}
                    className="rounded-lg border border-border bg-surface px-5 py-2.5 font-semibold text-secondary transition hover:bg-background disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={handleStartEdit}
                  className="rounded-lg bg-secondary px-5 py-2.5 font-semibold text-white transition hover:opacity-90"
                >
                  Edit
                </button>
              )}
            </div>
          </div>

          {errorMessage && (
            <p className="mt-4 text-sm text-red-600">{errorMessage}</p>
          )}
        </header>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
          <section className="min-w-0 rounded-2xl border border-border bg-surface p-4 shadow-sm md:p-6">
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
              pattern={patternForCanvas}
              cellSize={zoom.cellSize}
            />
          </section>

          <aside className="space-y-5">
            <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
              <h2 className="mb-3 text-xl font-semibold text-secondary">
                Pattern Details
              </h2>

              <dl className="space-y-3">
                <div className="border-b border-border pb-3">
                  <dt className="mb-2 text-text-secondary">Dimensions</dt>

                  {isEditing ? (
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label
                          htmlFor="pattern-width"
                          className="mb-1 block text-xs font-semibold text-text-secondary"
                        >
                          Width
                        </label>

                        <input
                          id="pattern-width"
                          type="number"
                          min="10"
                          max="200"
                          value={widthDraft}
                          onChange={(event) =>
                            setWidthDraft(event.target.value)
                          }
                          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="pattern-height"
                          className="mb-1 block text-xs font-semibold text-text-secondary"
                        >
                          Height
                        </label>

                        <input
                          id="pattern-height"
                          type="number"
                          min="10"
                          max="200"
                          value={heightDraft}
                          onChange={(event) =>
                            setHeightDraft(event.target.value)
                          }
                          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                    </div>
                  ) : (
                    <dd className="font-semibold text-secondary">
                      {pattern.stitchWidth} × {pattern.stitchHeight}
                    </dd>
                  )}
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

            <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
              <h2 className="mb-3 text-xl font-semibold text-secondary">
                Zoom
              </h2>

              <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2">
                <button
                  type="button"
                  onClick={zoomOut}
                  disabled={zoomIndex === 0}
                  aria-label="Zoom out"
                  className="h-10 w-10 rounded-lg border border-border bg-surface text-xl font-bold text-secondary transition hover:bg-background disabled:cursor-not-allowed disabled:opacity-40"
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
                  className="h-10 w-10 rounded-lg border border-border bg-surface text-xl font-bold text-secondary transition hover:bg-background disabled:cursor-not-allowed disabled:opacity-40"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={() => setZoomIndex(2)}
                disabled={zoomIndex === 2}
                className="mt-3 w-full rounded-lg border border-border px-4 py-2 text-sm font-semibold text-secondary transition hover:bg-background disabled:cursor-not-allowed disabled:opacity-40"
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

export default EditPage;
