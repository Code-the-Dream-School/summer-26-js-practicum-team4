import React, { useEffect, useRef, useState } from "react";
import { generatePattern, saveNewPattern } from "../services/patternService";
import PatternResult from "../components/features/pattern/PatternResult";

import DownloadPatternBtn from "../components/features/shared/DownloadPatternBtn";
import PatternNameEditInput from "../components/features/shared/PatternNameEditInput";

import { useAuth } from "../state/auth/useAuth";

function GeneratePage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [dimensionMode, setDimensionMode] = useState("width");
  const [stitchDimension, setStitchDimension] = useState("50");
  const [generatedPattern, setGeneratedPattern] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [editingThisPattern, setEditingThisPattern] = useState(false);
  const [currentPatternName, setCurrentPatternName] = useState(
    "Give this pattern a name?",
  );
  const [originalPatternName, setOriginalPatternName] = useState("");

  const canvasRef = useRef(null);
  const editFocus = useRef("");

  const { state, dispatch } = useAuth();

  useEffect(() => {
    if (editFocus.current) {
      editFocus.current.focus();
    }
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl, state.isEditing]);

  function handleEdit() {
    if (state.isEditing) {
      return;
    }

    setCurrentPatternName(
      currentPatternName ? currentPatternName : "generated_pattern",
    );
    setEditingThisPattern(true);
    setOriginalPatternName(currentPatternName);

    dispatch({ type: "BEGIN_PATTERN_NAME_EDITING" });

    return;
  }

  function patternEditInterface() {
    if (state.isEditing && editingThisPattern) {
      return (
        <PatternNameEditInput
          patternId={null}
          defaultPatternName={originalPatternName}
          currentPatternName={currentPatternName}
          setCurrentPatternName={setCurrentPatternName}
          setEditingThisPattern={setEditingThisPattern}
          ref={editFocus}
          textStyle="text-3xl mb-5"
        />
      );
    } else {
      return (
        <div className="flex gap-5 place-content-center">
          <h2 className={"text-3xl mb-5"}>{currentPatternName}</h2>
          <button className="col-start-6" onClick={handleEdit}>
            <img
              src="images/edit.png"
              className="hover:bg-gray-300 mb-5 w-10"
            />
          </button>
        </div>
      );
    }
  }

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setGeneratedPattern(null);
    setErrorMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      setErrorMessage("Please select an image first.");
      return;
    }

    const parsedDimension = Number(stitchDimension);

    if (
      stitchDimension.trim() === "" ||
      !Number.isInteger(parsedDimension) ||
      parsedDimension < 10 ||
      parsedDimension > 200
    ) {
      setErrorMessage(
        "Pattern dimension must be an integer between 10 and 200.",
      );
      return;
    }

    try {
      setIsGenerating(true);
      setErrorMessage("");

      const pattern = await generatePattern({
        image: selectedFile,
        ...(dimensionMode === "width"
          ? { width: parsedDimension }
          : { height: parsedDimension }),
      });

      setGeneratedPattern(pattern);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to generate the pattern.",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBackToGenerator = () => {
    setGeneratedPattern(null);
    setErrorMessage("");
  };

  const handleUploadNewImage = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    setDimensionMode("width");
    setStitchDimension("50");
    setGeneratedPattern(null);
    setErrorMessage("");
  };

  if (generatedPattern) {
    return (
      <>
        <div className="bg-background px-4 pt-8 lg:px-8">
          <div className="mx-auto max-w-[1600px] space-y-6">
            <div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between md:p-7">
              <div>{patternEditInterface()}</div>{" "}
              <div className="flex flex-col gap-2 sm:items-end">
                <button
                  onClick={async () => {
                    const savedPattern = await saveNewPattern({
                      patternName: currentPatternName,
                      stitchWidth: generatedPattern.width,
                      stitchHeight: generatedPattern.height,
                      grid: generatedPattern.grid,
                      palette: generatedPattern.palette,
                    });

                    if (savedPattern?.error?.message) {
                      dispatch({
                        type: "SET_ERROR",
                        payload: savedPattern.error.message,
                      });
                    }

                    return;
                  }}
                  className="rounded-lg bg-secondary px-5 py-2.5 font-semibold text-white transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  Save Pattern
                </button>
                <DownloadPatternBtn
                  origin="generatePg"
                  pattern={generatedPattern}
                  canvasRef={canvasRef}
                  patternName={currentPatternName}
                />
              </div>
            </div>{" "}
            {state.error && (
              <p className="rounded-lg bg-red-100 px-4 py-3 text-sm text-red-700">
                {state.error}
              </p>
            )}
          </div>{" "}
        </div>
        <PatternResult
          pattern={generatedPattern}
          previewUrl={previewUrl}
          fileName={selectedFile?.name || "Selected image"}
          canvasRef={canvasRef}
          onBack={handleBackToGenerator}
          onUploadNew={handleUploadNewImage}
        />
      </>
    );
  }

  return (
    <main className="min-h-screen bg-background px-4 py-10">
      <section className="mx-auto max-w-3xl rounded-2xl border border-border bg-surface p-6 shadow-md md:p-10">
        <h1 className="mb-8 text-center text-4xl font-bold text-secondary">
          Generate Pattern
        </h1>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label
              className="block font-semibold text-secondary"
              htmlFor="pattern-image"
            >
              Upload an image
            </label>

            <input
              id="pattern-image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="block w-full rounded-lg border border-border bg-background px-4 py-3 text-text file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-white"
            />

            {selectedFile && (
              <p className="text-sm text-text-secondary">
                Selected: {selectedFile.name}
              </p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label
                className="block font-semibold text-secondary"
                htmlFor="dimension-mode"
              >
                Size pattern by
              </label>

              <select
                id="dimension-mode"
                value={dimensionMode}
                onChange={(event) => setDimensionMode(event.target.value)}
                className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option value="width">Width</option>
                <option value="height">Height</option>
              </select>
            </div>

            <div className="space-y-2">
              <label
                className="block font-semibold text-secondary"
                htmlFor="stitch-dimension"
              >
                {dimensionMode === "width" ? "Width" : "Height"} in stitches
              </label>

              <input
                id="stitch-dimension"
                type="number"
                min="10"
                max="200"
                value={stitchDimension}
                onChange={(event) => setStitchDimension(event.target.value)}
                className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isGenerating}
            className="w-full rounded-lg bg-primary px-6 py-3 text-lg font-semibold text-white transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent disabled:cursor-wait disabled:opacity-60"
          >
            {isGenerating ? "Generating..." : "Generate Pattern"}
          </button>
        </form>

        {isGenerating && (
          <p className="mt-4 text-center text-secondary" role="status">
            Creating your cross-stitch pattern…
          </p>
        )}

        {errorMessage && (
          <p
            className="mt-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-center text-red-700"
            role="alert"
          >
            {errorMessage}
          </p>
        )}

        {previewUrl && (
          <section className="mt-8 border-t border-border pt-6">
            <h2 className="mb-4 text-2xl font-semibold text-secondary">
              Original Image
            </h2>

            <img
              src={previewUrl}
              alt="Selected image preview"
              className="max-h-80 w-full rounded-xl border border-border object-contain"
            />
          </section>
        )}
      </section>
    </main>
  );
}

export default GeneratePage;
