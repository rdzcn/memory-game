import { css } from "styled-components";

const sizes = {
  mobile: 0,
  tablet: 575,
  desktop: 1024,
  large: 1339,
  mega: 1919
};

export default Object.keys(sizes).reduce((acc, label) => {
  acc[label] = (...args) => css`
    @media (min-width: ${sizes[label]}px) {
      ${css(...args)};
    }
  `;
  return acc;
}, {});
