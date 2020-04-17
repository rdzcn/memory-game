import React from "react";
import {
  CardWrapper,
  CardTitle,
  CardBody,
  CardFooter 
} from "./Card.styles";

const Card = props => {
  const { title, cardBody, cardFooter } = props;
  return (
    <CardWrapper>
      <CardTitle>
        {title}
      </CardTitle>
      <CardBody>
        {cardBody}
      </CardBody>
      <CardFooter>
        {cardFooter}
      </CardFooter>
    </CardWrapper>
  );
};

export default Card;