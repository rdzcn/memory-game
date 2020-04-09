import React, { useState, useEffect } from "react";
//import io from "socket.io-client";
import { Switch, Route } from "react-router-dom";
import { AppContainer } from "./App.styles";
import Landing from "./pages/Landing/Landing";
import Game from "./pages/Game/Game";

function App() {

  return (
    <AppContainer>
      <Switch>
        <Route exact key="landing" path="/" component={Landing}/>
        <Route key="game" path="/game/:id" component={Game}/>
      </Switch>
    </AppContainer>
  );
}

export default App;
