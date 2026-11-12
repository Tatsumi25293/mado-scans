// Utility for compressing and converting client-side uploaded files to fast DataURLs

export const processImageFile = (file, maxWidth = 1200, maxHeight = 1600, quality = 0.86) => {
  return new Promise((resolve, reject) => {
    if (!file) return reject(new Error('No file provided'));
    if (!file.type.startsWith('image/')) {
      return reject(new Error('File is not an image'));
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Scale proportionally if dimensions exceed maximum
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Try WebP first for optimal size/quality ratio
          try {
            const webpUrl = canvas.toDataURL('image/webp', quality);
            if (webpUrl && webpUrl.startsWith('data:image/webp')) {
              return resolve(webpUrl);
            }
          } catch (_) {}

          // Fallback to JPEG
          resolve(canvas.toDataURL('image/jpeg', quality));
        } catch (err) {
          // If canvas fails, fallback to raw reader result
          resolve(e.target.result);
        }
      };
      img.onerror = () => reject(new Error('Failed to decode image'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

// Process multiple chapter page files sorted naturally
export const processChapterFiles = async (fileList, onProgress) => {
  const files = Array.from(fileList);
  
  // Natural alphanumeric sort so "page-1.jpg", "page-2.jpg", "page-10.jpg" are in order
  files.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));

  const processedPages = [];
  for (let i = 0; i < files.length; i++) {
    try {
      const dataUrl = await processImageFile(files[i], 1200, 2000, 0.85);
      processedPages.push(dataUrl);
      if (onProgress) onProgress(i + 1, files.length);
    } catch (err) {
      console.warn(`Error processing file ${files[i].name}:`, err);
    }
  }

  return processedPages;
};
