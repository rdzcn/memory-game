import React, { useEffect } from "react";
import { Row, Column } from "../../components/grid";
import { Header } from "./Landing.styles";

const Landing = () => {
 
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