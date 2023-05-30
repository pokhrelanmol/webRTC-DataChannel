import { getMessages } from "../services/message";
import { getUser } from "../services/user";

export const fetchMessages = async (chatId) => {
    try {
        const { data } = await getMessages(chatId);
        return data;
    } catch (error) {
        console.log(error);
    }
};

export const getUserData = async (userId) => {
    try {
        const { data } = await getUser(userId);
        return data;
    } catch (error) {
        console.log(error);
    }
};
