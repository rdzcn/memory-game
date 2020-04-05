import React, { useState, useEffect } from "react";
import useParams from "react-router";
import "./App.css";
import Landing from "pages/Landing/Landing";
import Game from "pages/Game/Game";


function App() {
  const [gameMode, setGameMode] = useState(false);
  const gameId = useParams();
  
  useEffect(() => {

  }, []);

  return (
    <div className="app">
      {gameId ? <Game /> : <Landing /> }  
    </div>
  );
}

export default App;
