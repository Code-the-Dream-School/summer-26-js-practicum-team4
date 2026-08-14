import React, { useEffect, useState } from "react";
import { generatePattern } from "../services/patternService";

function GeneratePage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [generatedPatternUrl, setGeneratedPatternUrl] = useState("");
  const [width, setWidth] = useState(50);
  const [height, setHeight] = useState(50);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      if (generatedPatternUrl) {
        URL.revokeObjectURL(generatedPatternUrl);
      }
    };
  }, [previewUrl, generatedPatternUrl]);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    if (generatedPatternUrl) {
      URL.revokeObjectURL(generatedPatternUrl);
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setGeneratedPatternUrl("");
    setErrorMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      setErrorMessage("Please select an image first.");
      return;
    }

    try {
      setIsGenerating(true);
      setErrorMessage("");

      const patternBlob = await generatePattern({
        image: selectedFile,
        width,
        height,
      });

      if (generatedPatternUrl) {
        URL.revokeObjectURL(generatedPatternUrl);
      }

      setGeneratedPatternUrl(URL.createObjectURL(patternBlob));
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

  const handleDownload = () => {
    if (!generatedPatternUrl) {
      setErrorMessage("Please generate a pattern before downloading.");
      return;
    }

    const downloadLink = document.createElement("a");

    downloadLink.href = generatedPatternUrl;
    downloadLink.download = "generated-pattern.png";

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <main>
      <h1>Generate Pattern</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="pattern-image">Upload an image</label>

          <input
            id="pattern-image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
          />
        </div>

        <div>
          <label htmlFor="pattern-width">Width</label>

          <input
            id="pattern-width"
            type="number"
            min="10"
            max="200"
            value={width}
            onChange={(event) => setWidth(Number(event.target.value))}
          />
        </div>

        <div>
          <label htmlFor="pattern-height">Height</label>

          <input
            id="pattern-height"
            type="number"
            min="10"
            max="200"
            value={height}
            onChange={(event) => setHeight(Number(event.target.value))}
          />
        </div>

        <button type="submit" disabled={isGenerating}>
          {isGenerating ? "Generating..." : "Generate Pattern"}
        </button>
      </form>

      {errorMessage && <p role="alert">{errorMessage}</p>}

      {previewUrl && (
        <section>
          <h2>Original Image</h2>

          <img src={previewUrl} alt="Selected image preview" width="300" />
        </section>
      )}

      {generatedPatternUrl && (
        <section>
          <h2>Generated Pattern</h2>

          <img
            src={generatedPatternUrl}
            alt="Generated pattern preview"
            width="300"
          />

          <div>
            <button type="button" onClick={handleDownload}>
              Download Pattern
            </button>
          </div>
        </section>
      )}
    </main>
  );
}

export default GeneratePage;
