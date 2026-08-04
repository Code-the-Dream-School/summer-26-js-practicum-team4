export async function generatePattern({ image, width = 50, height = 50 }) {
  const formData = new FormData();

  formData.append("image", image);
  formData.append("width", String(width));
  formData.append("height", String(height));

  const response = await fetch("/api/patterns/generate", {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!response.ok) {
    let message = "Unable to generate the pattern.";

    const contentType = response.headers.get("content-type");

    if (contentType?.includes("application/json")) {
      const errorData = await response.json();
      message = errorData.message || message;
    }

    throw new Error(message);
  }

  return response.blob();
}
