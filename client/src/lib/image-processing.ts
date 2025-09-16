export function downloadImage(dataUrl: string, filename: string = 'stache-stash-photo.png'): void {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function resizeImage(
  canvas: HTMLCanvasElement,
  maxWidth: number = 1200,
  maxHeight: number = 1200,
  quality: number = 0.8
): string {
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas.toDataURL();

  const { width, height } = canvas;
  let { width: newWidth, height: newHeight } = canvas;

  // Calculate new dimensions while maintaining aspect ratio
  if (width > height) {
    if (newWidth > maxWidth) {
      newHeight = (newHeight * maxWidth) / newWidth;
      newWidth = maxWidth;
    }
  } else {
    if (newHeight > maxHeight) {
      newWidth = (newWidth * maxHeight) / newHeight;
      newHeight = maxHeight;
    }
  }

  // Create a new canvas for resizing
  const resizeCanvas = document.createElement('canvas');
  const resizeCtx = resizeCanvas.getContext('2d');
  
  if (!resizeCtx) return canvas.toDataURL();

  resizeCanvas.width = newWidth;
  resizeCanvas.height = newHeight;

  // Draw the resized image
  resizeCtx.drawImage(canvas, 0, 0, newWidth, newHeight);

  return resizeCanvas.toDataURL('image/png', quality);
}

export function applyMustacheToCanvas(
  canvas: HTMLCanvasElement,
  mustacheImage: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.drawImage(mustacheImage, x, y, width, height);
}
