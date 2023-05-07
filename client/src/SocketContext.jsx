import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

const SocketProvider = ({ children }) => {
    const socket = useMemo(() => io("http://localhost:5000"), []);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketProvider;
export const useSocket = () => useContext(SocketContext);
