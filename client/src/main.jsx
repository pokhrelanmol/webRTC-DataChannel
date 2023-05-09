import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import SocketProvider from "./SocketContext.jsx";
import MessageProvider from "./MessageContext.jsx";
import PeerProvider from "./PeerContext.jsx";
import UserProvider from "./contexts/UserContext.jsx";

import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
    <UserProvider>
        <MessageProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </MessageProvider>
    </UserProvider>
);
