import React from "react";
import { ButtonContainer } from "./Button.styles";

const Button = props => {
  return (
    <ButtonContainer form="createGameForm">
      {props.children}
    </ButtonContainer>
  );
};

export default Button;