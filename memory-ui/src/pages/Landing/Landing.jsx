import React, { useEffect } from "react";
import { Row, Column, PageWrapper } from "../../components/grid";
import { Header, Image, Title } from "./Landing.styles";
import backgroundImg from "../../assets/landing.svg";

const Landing = () => {
 
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
          <Title>
            Create a Game
          </Title>
        </Column>
        <Column span={{ mobile: 4, tablet: 4, desktop: 8 }}>
          <Title>
            Join a Game
          </Title>
        </Column>
      </Row>
    </Row>
  ); 
};

export default Landing;