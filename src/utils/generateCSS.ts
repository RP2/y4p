import { TextStyle } from "./interfaces";

export const generateCSS = (textStyle: TextStyle): Promise<void> => {
  return new Promise((resolve) => {
    const styleElement =
      document.getElementById("styles") ??
      document.head.appendChild(
        Object.assign(document.createElement("style"), { id: "styles" }),
      );

    // Single rule using CSS custom properties
    const css = `
      [data-px]::selection {
        color: ${textStyle === TextStyle.INVERTED ? "var(--inv)" : "transparent"};
        background-color: var(--rgb);
      }
      ::selection {
        color: inherit;
        background-color: rgba(0,0,0,.1);
      }
    `;

    styleElement.textContent = css;
    resolve();
  });
};
