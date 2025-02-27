import type { ImageData, Pixel } from "./interfaces";

export const getImageData = async (
  imagePath: string, // Change to string type since we're using direct path
  targetWidth: number,
): Promise<ImageData> => {
  if (typeof window === "undefined") {
    return {
      pixels: Array(targetWidth * targetWidth).fill({ r: 0, g: 0, b: 0 }),
      width: targetWidth,
      height: targetWidth,
    };
  }

  try {
    const img = await createImage(imagePath);

    // Increase sampling resolution
    const scaleFactor = window.devicePixelRatio || 1;
    const sampledWidth = targetWidth * scaleFactor;
    const aspectRatio = img.height / img.width;
    const sampledHeight = Math.floor(sampledWidth * aspectRatio);

    // Create high-res canvas for better sampling
    const { canvas, context } = createOptimizedCanvas(
      sampledWidth,
      sampledHeight,
    );

    // Enable high-quality image rendering
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";

    // Draw at higher resolution
    context.drawImage(img, 0, 0, sampledWidth, sampledHeight);

    // Scale back down to target size with better quality
    const finalCanvas = createOptimizedCanvas(
      targetWidth,
      Math.floor(targetWidth * aspectRatio),
    );
    const finalContext = finalCanvas.context;
    finalContext.imageSmoothingEnabled = true;
    finalContext.imageSmoothingQuality = "high";
    finalContext.drawImage(
      canvas,
      0,
      0,
      targetWidth,
      Math.floor(targetWidth * aspectRatio),
    );

    // Get final image data
    const { data } = finalContext.getImageData(
      0,
      0,
      targetWidth,
      Math.floor(targetWidth * aspectRatio),
    );

    // Pre-allocate pixels array for better performance
    const totalPixels = targetWidth * Math.floor(targetWidth * aspectRatio);
    const pixels = new Array<Pixel>(totalPixels);

    // Process pixels in single loop for better performance
    for (let i = 0; i < totalPixels; i++) {
      const dataIndex = i * 4;
      pixels[i] = {
        r: data[dataIndex],
        g: data[dataIndex + 1],
        b: data[dataIndex + 2],
      };
    }

    return {
      pixels,
      width: targetWidth,
      height: Math.floor(targetWidth * aspectRatio),
    };
  } catch (err) {
    console.error("Error processing image:", err);
    throw err; // Re-throw to handle in the UI
  }
};

// Helper functions for better code organization and reuse
const createImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous"; // Add this if needed for external images
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(new Error(`Failed to load image: ${e}`));
    img.src = src;
  });
};

const createOptimizedCanvas = (width: number, height: number) => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d", {
    alpha: false,
    willReadFrequently: true,
  });

  if (!context) {
    throw new Error("Could not get canvas context");
  }

  canvas.width = width;
  canvas.height = height;

  return { canvas, context };
};
