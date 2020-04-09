import React, { useEffect } from "react";
import io from "socket.io-client";
import { Row, Column } from "../../components/grid";
import { Header } from "./Landing.styles";

const Landing = () => {
  const URL = window.location.href;
  const socket = io(URL);

  useEffect(() => {
    if (socket) {
      socket.on("connect",() => {
        console.log("SOCKET-ID-LANDING", socket.id);
      });
    }
  }, [socket]);

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