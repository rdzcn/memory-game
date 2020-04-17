import React, { useEffect } from "react";
import { Row, Column } from "../../components/grid";
import Card  from "../../components/card/Card";
import { Header, Image, Title } from "./Landing.styles";
import NewGameForm from "../../components/form/Form";
import Button from "../../components/button/Button";

import backgroundImg from "../../assets/landing.svg";

const Landing = () => {
 
  const createGame = event => {
    event.preventDefault();
       
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
          <Card title="Create a new game" cardBody={<NewGameForm />} cardFooter={<Button type="submit">Start</Button>} />
        </Column>
        <Column span={{ mobile: 4, tablet: 4, desktop: 8 }}>
          <Card title="Join a game" />
        </Column>
      </Row>
    </Row>
  ); 
};

export default Landing;