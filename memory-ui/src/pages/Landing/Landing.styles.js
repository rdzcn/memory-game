import styled from "styled-components";

export const Header = styled.header`
  display: flex;
  flex-direction: column;
  text-align: center;
  width: 100%;
  `;

export const Image = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
`;

export const Title = styled.h1`
  color: #625872;
  font-size: 24px;
  background: linear-gradient(to right, #eb816f, #f99d78 40%, #eb816f 90%);
  line-height: 1.5;
  width: 100%;
  margin: 0 auto 1rem;
  padding: 1rem;
  text-align: center; 
`;