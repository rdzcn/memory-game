import React, { useEffect } from "react";
import { Row, Column } from "../../components/grid";
import Card  from "../../components/card/Card";
import { Header, Image, Title } from "./Landing.styles";
import NewGameForm from "../../components/form/NewGameForm";
import Button from "../../components/button/Button";
import io from "socket.io-client";

import backgroundImg from "../../assets/landing.svg";

const Landing = () => {
 
  const socket = io("http://localhost:3001",{
    transports: ["websocket"],
    rejectUnauthorized: false,
  });

  useEffect(() => {
    socket.emit("connect", socket);
    socket.on("message", message => {
      console.log("MESSAGE from SERVER", message);
    });
  });

  const createGame = formData => {
    const nickname = formData.get("nickname");
    const password = null || formData.get("password");
    const game = {
      id: 1,
      players: [
        {
          nickname: nickname,
          id: socket.id
        }
      ],
      password: password
    };
    
    socket.emit("game created", game);
    window.location = `/games/${game.id}`;
  };

  return (
    <Row>
      <Header>
        <Image src={backgroundImg} alt="colorful space station" />
        <Title>
          Share New Memories and Have Fun With Your Friends
        </Title>
      </Header>
      <Row>
        <Column span={{ mobile: 4, tablet: 2, desktop: 4 }}>
          <Card title="Create a new game" cardBody={<NewGameForm createGame={createGame}/>} cardFooter={<Button type="submit">Start</Button>} />
        </Column>
        <Column span={{ mobile: 4, tablet: 4, desktop: 8 }}>
          <Card title="Join a game" />
        </Column>
      </Row>
    </Row>
  ); 
};

export default Landing;