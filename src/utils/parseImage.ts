import { getImage } from "astro:assets";
import type { ImageData, Pixel } from "./interfaces";

export const getImageData = async (
  imagePath: ImageMetadata,
  targetWidth: number,
): Promise<ImageData> => {
  if (typeof window === "undefined") {
    const pixels = Array(targetWidth * targetWidth).fill({ r: 0, g: 0, b: 0 });
    return { pixels, width: targetWidth, height: targetWidth };
  }

  try {
    // Pre-optimize image with better quality settings
    const optimizedImage = await getImage({
      src: imagePath,
      width: targetWidth * 2, // Double width for better downsampling
      format: "webp",
      quality: "high",
    });

    // Create and load image
    const img = await createImage(optimizedImage.src);

    // Calculate dimensions once
    const aspectRatio = img.height / img.width;
    const targetHeight = Math.floor(targetWidth * aspectRatio);
    const totalPixels = targetWidth * targetHeight;

    // Create optimized canvas
    const { canvas, context } = createOptimizedCanvas(
      targetWidth,
      targetHeight,
    );

    // Draw image with high quality settings
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.drawImage(img, 0, 0, targetWidth, targetHeight);

    // Get image data in one operation
    const { data } = context.getImageData(0, 0, targetWidth, targetHeight);

    // Pre-allocate pixels array for better performance
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

    return { pixels, width: targetWidth, height: targetHeight };
  } catch (err) {
    console.error("Error processing image:", err);
    return { pixels: [], width: 0, height: 0 };
  }
};

// Helper functions for better code organization and reuse
const createImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image"));
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
