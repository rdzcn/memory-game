import styled from "styled-components";

export const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 1rem;
  box-shadow: 0 0 6px rgba(98, 88, 114, 0.3);
  border-radius: 6px;
`;

export const CardTitle = styled.h1`
  color: #625872;
  font-size: 24px;
  background: linear-gradient(to right, #eb816f, #f99d78 40%, #eb816f 90%);
  line-height: 1.5;
  width: 100%;
  margin: 0 auto 1rem;
  padding: 1rem;
  text-align: center;
  border-radius: 6px; 
`;

export const CardBody = styled.div`
  display: flex;
  width: 100%;
`;

export const CardFooter = styled.div`
  display: flex;
  width: 100%;
`;
