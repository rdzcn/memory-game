import React, { useEffect } from "react";
import io from "socket.io-client";
import { Row, Column } from "../../components/grid";
import { Header } from "./Landing.styles";

const Landing = () => {
  const URL = "http://localhost:3001";
  const socket = io(URL);

  useEffect(() => {
    socket.on("connect",() => {
      console.log("SOCKET-ID-LANDING", socket.id);
    });
  }, [socket, URL]);

  return (
    <Row>
      <Column span={{ mobile: 4, tablet: 3, desktop: 3 }}>
        <Header>
          Welcome - Landing Page
        </Header>
      </Column>
    </Row>
  ); 
};

export default Landing;