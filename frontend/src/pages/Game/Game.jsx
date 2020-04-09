import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { Row, Column } from "../../components/grid";
import { Header } from "./Game.styles";

const Game = () => {
  const URL = window.location.href;
  const socket = io(URL);
  const [myTurn, setMyTurn] = useState(false);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("SOCKET-ID-GAME", socket.id);
    });
  }, [socket]);

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