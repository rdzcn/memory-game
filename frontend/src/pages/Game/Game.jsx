import React from "react";
import { Row, Column } from "../../components/grid";
import { Header } from "./Game.styles";

const Game = () => {
  return (
    <Row>
      <Column span={{ mobile: 4, tablet: 3, desktop: 3 }}>
        <Header>
            Game Page
        </Header>
      </Column>
    </Row>
  ); 
};

export default Game;