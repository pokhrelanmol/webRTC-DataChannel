import { createContext, useContext, useRef, useState } from "react";

const PeerContext = createContext();

const PeerProvider = ({ children }) => {
    const [peer, setPeer] = useState();

    return (
        <PeerContext.Provider value={{ peer, setPeer }}>
            {children}
        </PeerContext.Provider>
    );
};

export default PeerProvider;
export const usePeer = () => useContext(PeerContext);
