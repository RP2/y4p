import type { ImageSize, Pixel } from "./interfaces";

export const repeatText = async (
  text: string,
  imageSize: ImageSize,
  pixels: Pixel[], // Add pixels parameter
): Promise<string> => {
  const { width, height } = imageSize;
  const requiredLength = width * height;

  // Pre-calculate repeated text more efficiently
  const repetitions = Math.ceil(requiredLength / text.length);
  let repeatedText = Array(repetitions).fill(text).join(" ");
  if (repeatedText.length > requiredLength) {
    repeatedText = repeatedText.slice(0, requiredLength);
  }

  // Pre-compile templates for better performance
  const makeSpan = (index: number, content: string) => {
    const pixel = pixels[index];
    const { r, g, b } = pixel;
    return `<span data-px style="--rgb:rgb(${r},${g},${b});--inv:rgb(${255 - r},${255 - g},${255 - b})">${content}</span>`;
  };

  const makeSpace = (index: number) => makeSpan(index, "&nbsp;");

  const words = repeatedText.split(" ");
  const rows: string[] = [];
  let currentRow: string[] = [];
  let lineStart = 0;
  let currentWidth = 0;
  let totalChars = 0;

  for (const word of words) {
    // Check if adding this word would exceed total required length
    if (totalChars + word.length > requiredLength - 3) {
      // Truncate the last word and add ellipsis
      const remainingSpace = requiredLength - totalChars - 3;
      if (remainingSpace > 0) {
        const truncatedWord = word.slice(0, remainingSpace);
        const wordSpans = Array.from(truncatedWord)
          .map((char, i) => makeSpan(lineStart + currentWidth + i, char))
          .join("");
        currentRow.push(wordSpans);
      }
      // Add ellipsis
      const ellipsisStart = lineStart + currentWidth + remainingSpace;
      currentRow.push(
        makeSpan(ellipsisStart, ".") +
          makeSpan(ellipsisStart + 1, ".") +
          makeSpan(ellipsisStart + 2, "."),
      );
      rows.push(currentRow.join(""));
      break;
    }

    // Check if word fits on current line
    if (currentWidth + word.length > width && currentWidth > 0) {
      // Pad current line to width with spaces
      while (currentWidth < width) {
        currentRow.push(makeSpace(lineStart + currentWidth));
        currentWidth++;
        totalChars++;
      }
      rows.push(currentRow.join(""));
      currentRow = [];
      lineStart += width;
      currentWidth = 0;
    }

    // Process each character in the word
    const wordSpans = Array.from(word)
      .map((char, i) => makeSpan(lineStart + currentWidth + i, char))
      .join("");

    currentRow.push(wordSpans);
    currentWidth += word.length;
    totalChars += word.length;

    // Add space after word if there's room
    if (currentWidth < width && totalChars < requiredLength) {
      currentRow.push(makeSpace(lineStart + currentWidth));
      currentWidth++;
      totalChars++;
    }
  }

  // Modified return to include a wrapper div with data attribute for style preloading
  return `<p data-preload="true">${rows.join("\n")}</p>`;
};
