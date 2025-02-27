import { TextStyle, type Pixel } from "./interfaces";

export const generateCSS = (
  pixels: Pixel[],
  textStyle: TextStyle,
): Promise<void> => {
  return new Promise((resolve) => {
    // Increase chunk size for better performance with large images
    const CHUNK_SIZE = 2000;
    const cssRules: string[] = [];
    const template = getTemplateForStyle(textStyle);

    // Process pixels in chunks
    for (let i = 0; i < pixels.length; i += CHUNK_SIZE) {
      const chunk = pixels
        .slice(i, i + CHUNK_SIZE)
        .map((pixel, index) => template(i + index, pixel))
        .join("");
      cssRules.push(chunk);
    }

    // Use cached style element or create new one
    const styleElement =
      document.getElementById("styles") ??
      document.head.appendChild(
        Object.assign(document.createElement("style"), { id: "styles" }),
      );

    // Update styles in one operation
    styleElement.textContent =
      cssRules.join("") +
      "::selection{color:inherit;background-color:rgba(0,0,0,.1)}";
    resolve();
  });
};

// Pre-compile template functions for each style
const getTemplateForStyle = (textStyle: TextStyle) => {
  switch (textStyle) {
    case TextStyle.INVERTED:
      return (index: number, { r, g, b }: Pixel) =>
        `.color-${index}::selection{color:rgb(${255 - r},${255 - g},${255 - b});background-color:rgb(${r},${g},${b})}`;
    case TextStyle.VEILED:
      return (index: number, { r, g, b }: Pixel) =>
        `.color-${index}::selection{color:rgba(0,0,0,.1);background-color:rgb(${r},${g},${b})}`;
    default:
      return (index: number, { r, g, b }: Pixel) =>
        `.color-${index}::selection{color:transparent;background-color:rgb(${r},${g},${b})}`;
  }
};
