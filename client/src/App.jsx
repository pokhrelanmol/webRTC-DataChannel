import { Routes, Route } from "react-router-dom";
import Chat from "./components/Chat";
import Auth from "./components/Auth";

import * as Kilt from "@kiltprotocol/sdk-js";
import { useEffect } from "react";
import { getDidDoc } from "./lib/src/kilt/didResolver";
function App() {
    useEffect(() => {
        (async () => {
            await Kilt.connect("wss://peregrine.kilt.io/parachain-public-ws");
        })();
    }, []);
    return (
        <>
            <h1 className="text-red-800 text-2xl text-center ">Chat App</h1>
            <Routes>
                <Route path="/" element={<Auth />} />
            </Routes>
            <Routes>
                <Route path="/chat" element={<Chat />} />
            </Routes>
        </>
    );
}

export default App;
