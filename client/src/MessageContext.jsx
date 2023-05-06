import { createContext, useContext, useState } from "react";

const MessageContext = createContext();

const MessageProvider = ({ children }) => {
    const [messages, setMessages] = useState([]);

    return (
        <MessageContext.Provider value={{ messages, setMessages }}>
            {children}
        </MessageContext.Provider>
    );
};

export default MessageProvider;
export const useMessage = () => useContext(MessageContext);
