import React, { useState } from "react";
import { FormWrapper, Input, Label } from "./Form.styles";


const NewGameForm = props => {
  return (
    <FormWrapper id="createGameForm" onSubmit={props.createGame}>
      <Label>Enter a nickname</Label>
      <Input type="text" name="nickname" onChange={handleChange} placeholder="Enter nickname" required/>
      <Label>Set and share a password if you want to play with a particular friend</Label>
      <Input type="text" name="password" placeholder="Password to share with your friend" />
    </FormWrapper>
  );
};

export default NewGameForm; 