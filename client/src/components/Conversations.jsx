import React, { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";
import { getUser } from "../services/user";
import { formatDid } from "../utils";
const Conversation = ({ data }) => {
    // fetch all user chats
    const { currentUser } = useUser();
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const userId = data?.members.find((id) => id !== currentUser._id);
        const getUserData = async () => {
            try {
                const { data } = await getUser(userId);

                setUserData(data);
            } catch (error) {
                console.log(error);
            }
        };

        getUserData();
    }, []);

    return (
        <div className="bg-red-500 text-center text-xl text-white p-3 shadow-md w-full rounded-lg cursor-pointer">
            {userData?.did && formatDid(userData.did)}
        </div>
    );
};

export default Conversation;
