import React, { useState } from "react";
import { FormWrapper, Input, Label } from "./Form.styles";


const NewGameForm = props => {
  return (
    <FormWrapper>
      <Label>Enter a nickname</Label>
      <Input type="text" placeholder="Enter nickname" required/>
      <Label>Set and share a password if you want to play with a particular friend</Label>
      <Input type="text" placeholder="Password to share with your friend" />
    </FormWrapper>
  );
};

export default NewGameForm; 