import React, { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";
import { getUser } from "../services/user";
const Conversation = ({ data }) => {
    // fetch all user chats
    const { currentUser } = useUser();
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        console.log(data.members);
        const userId = data.members.find((id) => id !== currentUser._id);
        const getUserData = async () => {
            try {
                const { data } = await getUser(userId);
                console.log(data);
                setUserData(data);
            } catch (error) {
                console.log(error);
            }
        };

        getUserData();
    }, []);

    const handleOpenChat = (id) => {};
    return (
        <div className="">
            <span
                className="bg-gray-500 text-white py-1 px-3 rounded-lg cursor-pointer"
                onClick={() => handleOpenChat(userData._id)}
            >
                {userData?.email}
            </span>
        </div>
    );
};

export default Conversation;
