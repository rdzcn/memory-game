import React from "react";
import {
  CardWrapper,
  CardTitle,
  CardBody,
  CardFooter 
} from "./Card.styles";

const Card = props => {
  const { title, cardBody } = props;
  return (
    <CardWrapper>
      <CardTitle>
        {title}
      </CardTitle>
      <CardBody>
        {cardBody}
      </CardBody>
      <CardFooter>

      </CardFooter>
    </CardWrapper>
  );
};

export default Card;