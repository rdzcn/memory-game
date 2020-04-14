import styled from "styled-components";
import media from "../../utils/media";

export const Column = styled.div`
  --span: ${props => props.span.mobile};
  width: calc(
    (
      (100% - ((var(--n) - 1) * var(--g))) / var(--n)) * var(--span) + (var(--span) - 1) * var(--g)
  );
  ${media.tablet`
    --span: ${props => props.span.tablet};
  `}
  ${media.desktop`
    --span: ${props => props.span.desktop};
  `}
`;
