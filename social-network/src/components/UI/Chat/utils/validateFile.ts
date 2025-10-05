export function isValidImage(file: File): boolean {
  const imageTypeRegex = /^image\/(?!svg+xml).+/;
  const maxSize = 10 * 1024 * 1024;
  return imageTypeRegex.test(file.type) && file.size <= maxSize;
}

export function createImagePreview(file: File): string {
  return URL.createObjectURL(file);
}

export function retryImageLoad(imgElement: HTMLImageElement, file: File) {
  const retrySrc = URL.createObjectURL(file);
  setTimeout(() => {
    imgElement.src = retrySrc;
  }, 1000); 
}