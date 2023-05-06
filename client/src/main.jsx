import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import SocketProvider from "./SocketContext.jsx";
import MessageProvider from "./MessageContext.jsx";
import PeerProvider from "./PeerContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
    <MessageProvider>
        <PeerProvider>
            <SocketProvider>
                <App />
            </SocketProvider>
        </PeerProvider>
    </MessageProvider>
);
