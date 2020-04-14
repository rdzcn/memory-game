import styled, { css } from "styled-components";
import { media } from "./styles/mediaTypes";

export const AppContainer = styled.div`
  --n: 4;
  --g: 12px;
  --m: 12px;

  position: relative;
  min-height: 100vh;
  width: 100vw;
  padding: var(--m);

  ${media.tablet(css`
    --n: 6;
    --g: 24px;
    --m: 24px;
  `)} 

  ${media.desktop(css`
    --n: 12;
  `)} 
  
  ${media.desktopL(css`
    --m: 36px;
  `)}
`;