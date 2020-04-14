import { css } from "styled-components";

export const mediaSizes = {
  mobile: 376,
  tablet: 768,
  desktop: 1023,
  desktopL: 1112,
};

export const media = Object.keys(mediaSizes).reduce((acc, label) => {
  acc[label] = (first, ...interpolations) => css`
    @media (min-width: ${mediaSizes[label]}px) {
      ${css(first, ...interpolations)}
    }
  `;
  return acc;
}, {});
