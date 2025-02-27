/**
 * Represents a single pixel with RGB values.
 * Each value ranges from 0 (minimum intensity) to 255 (maximum intensity).
 *
 * @interface Pixel
 * @property {number} r - Red component of the pixel
 * @property {number} g - Green component of the pixel
 * @property {number} b - Blue component of the pixel
 */
export interface Pixel {
  r: number;
  g: number;
  b: number;
}

/**
 * Represents an image's data including its pixels, width, and height.
 *
 * The `pixels` array is a flat representation of image data,
 * typically stored in row-major order. Each element is an instance of {@link Pixel}.
 *
 * @interface ImageData
 * @property {Pixel[]} pixels - Array of pixel data
 * @property {number} width - Width of the image in pixels
 * @property {number} height - Height of the image in pixels
 */
export interface ImageData {
  pixels: Pixel[];
  width: number;
  height: number;
}

/**
 * Represents the dimensions (width and height) of an image.
 *
 * @interface ImageSize
 * @property {number} width - Width of the image
 * @property {number} height - Height of the image
 */
export interface ImageSize {
  width: number;
  height: number;
}

/**
 * Enumeration of text styles for body text rendering.
 *
 * @enum TextStyle
 * @readonly
 * @property {number} TRANSPARENT - Text is invisible (transparent)
 * @property {number} INVERTED - Text has inverted colors (white on black)
 * @property {number} VEILED - Text appears translucent
 */
export enum TextStyle {
  /** Text is invisible (transparent) */
  TRANSPARENT = 0,
  /** Text has inverted colors (white on black) */
  INVERTED = 1,
  /** Text appears translucent */
  VEILED = 2,
}

/**
 * Properties passed into the TextBlock component.
 *
 * @interface TextBlockProps
 * @property {string} text - String of text to display
 * @property {Pixel[]} image - Array of pixel data representing an image
 * @property {number} imgScale - Scale factor for adjusting image size
 */
export interface TextBlockProps {
  text: string;
  image: Pixel[];
  imgScale: number;
}

/**
 * Properties passed into the Modal component.
 *
 * The modal handles state management through these functions and properties:
 *
 * - `setText`: Updates the body text state
 * - `setImgSrc`: Updates the image source state
 * - `setTextStyle`: Updates the text style state (see {@link TextStyle})
 * - `setImgScale`: Adjusts the scale of the displayed image
 *
 * @interface ModalProps
 * @property {function} setText - State setter for body text
 * @property {function} setImgSrc - State setter for image source
 * @property {function} setTextStyle - State setter for text style (TextStyle)
 * @property {function} setImgScale - Function to adjust the scale of the displayed image
 * @property {number} imgScale - Current scale of the image (measured in pixels)
 * @property {boolean} loading - Determines if the application is in a loading state
 */
export interface ModalProps {
  setText: (text: string) => void;
  setImgSrc: (src: any) => void;
  setTextStyle: (style: TextStyle) => void;
  setImgScale: (scale: number) => void;
  imgScale: number;
  loading: boolean;
}
