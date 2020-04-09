import React from "react";
import io from "socket.io-client";

export const SocketContext = React.createContext({games: {}});

export const useWebsocket = () => React.useContext(SocketContext);