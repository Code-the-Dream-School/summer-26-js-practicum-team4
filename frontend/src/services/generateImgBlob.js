function generateImgBlob(canvasRef, setImgBlob) {
  canvasRef.current.toBlob((blob) => {
    setImgBlob(blob);
  }, "image/png");

  return;
}

export default generateImgBlob;
