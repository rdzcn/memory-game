import React, { useState, useEffect } from "react";
import useParams from "react-router";
import "./App.css";

function App() {
  const [gameMode, setGameMode] = useState(false);
  const gameId = useParams();
  useEffect(() => {

  }, [])
  return (
    <div className="app">
      {gameId ? <Game /> : <Landing /> }  
    </div>
  );
}

export default App;
