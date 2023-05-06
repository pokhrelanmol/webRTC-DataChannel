import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState({});

    useEffect(() => {
        const newSocket = io("http://localhost:5000");
        setSocket(newSocket);
    }, []);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketProvider;
export const useSocket = () => useContext(SocketContext);
