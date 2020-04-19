import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { Row, Column } from "../../components/grid";
import { Header, Image, Title } from "../Landing/Landing.styles";
import Card  from "../../components/card/Card";
import backgroundImg from "../../assets/landing.svg";

const Game = () => {
  const URL = window.location.href;
  const socket = io(URL, {
    transports: ["websocket"],
    rejectUnauthorized: false,
  });
  const [myTurn, setMyTurn] = useState(false);

  useEffect(() => {
    socket.emit("connect", socket);
    socket.on("message", message => {
      console.log("MESSAGE from SERVER", message);
    });
  });

  return (
    <Row>
      <Header>
        <Image src={backgroundImg} alt="colorful space station" />
        <Title>
          Player 1 vs Player 2
        </Title>
      </Header>
      <Row>
        <Column span={{ mobile: 1, tablet: 2, desktop: 3 }}>
          <Card title="Player 1" cardBody={<div>BODY</div>} cardFooter={<div>FOOTER</div>} />
        </Column>
        <Column span={{ mobile: 2, tablet: 2, desktop: 6 }}>
          <Card title="Game Board" cardBody={<div>BODY</div>} cardFooter={<div>FOOTER</div>} />
        </Column>
        <Column span={{ mobile: 1, tablet: 2, desktop: 3 }}>
          <Card title="Player 2" cardBody={<div>BODY</div>} cardFooter={<div>FOOTER</div>} />
        </Column>
      </Row>
    </Row>
  ); 
};

export default Game;