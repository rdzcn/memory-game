import React from "react";
import useRouteMatch from "react-router";
import { Row, Column } from "../../components/grid";
import { Header } from "./Game.styles";

const Game = () => {

  const match = useRouteMatch("/games/:id");

  return (
    <>
      { match && 
        <Row>
          <Column span={{ mobile: 4, tablet: 3, desktop: 3 }}>
            <Header>
              Game Page
            </Header>
          </Column>
        </Row>
      }
    </>
  ); 
};

export default Game;