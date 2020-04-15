import { css } from "styled-components";

export const mediaSizes = {
  mobile: 360,
  tablet: 768,
  desktop: 1024,
  desktopL: 1440,
};

export const media = Object.keys(mediaSizes).reduce((acc, label) => {
  acc[label] = (first, ...interpolations) => css`
    @media (min-width: ${mediaSizes[label]}px) {
      ${css(first, ...interpolations)}
    }
  `;
  return acc;
}, {});
