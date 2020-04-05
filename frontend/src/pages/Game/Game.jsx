import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { Row, Column } from "../../components/grid";
import { Header } from "./Game.styles";

const Game = () => {
  const URL = "http://localhost:3001/game/:id";
  const socket = io(URL);
  const [myTurn, setMyTurn] = useState(false);

  useEffect(() => {
    socket.on("connect", () => console.log("SOCKET-ID-GAME", socket.id));
  }, [socket, URL]);

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