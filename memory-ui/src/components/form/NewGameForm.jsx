import React, { useState } from "react";
import { FormWrapper, Input, Label } from "./Form.styles";

const NewGameForm = props => {

  const handleSubmit = event => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    props.createGame(formData);
  };

  return (
    <FormWrapper id="createGameForm" onSubmit={handleSubmit}>
      <Label>Enter a nickname</Label>
      <Input type="text" name="nickname" placeholder="Enter nickname" required/>
      <Label>Set and share a password if you want to play with a particular friend</Label>
      <Input type="text" name="password" placeholder="Password to share with your friend" />
    </FormWrapper>
  );
};

export default NewGameForm; 