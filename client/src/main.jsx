import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import MessageProvider from "./MessageContext.jsx";
import UserProvider from "./contexts/UserContext.jsx";
import PeerProvider from "./contexts/PeerContext.jsx";

import { BrowserRouter } from "react-router-dom";
import SocketProvider from "./contexts/SocketContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
    <PeerProvider>
        <SocketProvider>
            <UserProvider>
                <MessageProvider>
                    <BrowserRouter>
                        <App />
                    </BrowserRouter>
                </MessageProvider>
            </UserProvider>
        </SocketProvider>
    </PeerProvider>
);
