import React, { useState } from "react";
import axios from "axios";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { logIn, register } from "../services/Auth";
import { generateKeypairs } from "../lib/src/kilt/keyAggrement";
const Auth = () => {
    const [did, setDid] = useState("");
    const [mnemonic, setMnemonic] = useState("");
    const [isLoggingIn, setIsLogginIn] = useState(false);
    const navigate = useNavigate();
    const { setCurrentUser, currentUser } = useUser();
    const registerUser = async (e) => {
        e.preventDefault();
        try {
            const user = await register({ did });
            console.log(user);
            const dataFromMnemonic = generateKeypairs(mnemonic);
            // localStorage.setItem({
            //     mnemonic: mnemonic,
            // did,
            //     ...dataFromMnemonic
            // });
            setCurrentUser({
                mnemonic: mnemonic,
                did,
                ...dataFromMnemonic,
                _id: user?.data.message._id,
            });
            // setCurrentUser(user.data.message);
            navigate("/chat");
        } catch (error) {
            console.log(error);
            alert("Something Went Wrong");
        }
    };
    const loginUser = async (e) => {
        e.preventDefault();
        try {
            const user = await logIn({ did });
            const dataFromMnemonic = generateKeypairs(mnemonic);
            // localStorage.setItem({
            //     mnemonic: mnemonic,
            // did,
            //     ...dataFromMnemonic
            // });
            setCurrentUser({
                mnemonic: mnemonic,
                did,
                ...dataFromMnemonic,
                _id: user?.data.message._id,
            });
            // setCurrentUser(user.data.message);
            navigate("/chat");
        } catch (error) {
            console.log(error);
            alert("Something Went Wrong");
        }
    };

    return (
        <div className="flex flex-col h-screen justify-center bg-[#E76161] p-2 items-center gap-2 ">
            <h1 className="text-2xl font-bold">
                {isLoggingIn ? "Login" : "Register"}
            </h1>
            <form
                className="flex border shadow-md rounded-md p-20  flex-col gap-3"
                action=""
                onSubmit={isLoggingIn ? loginUser : registerUser}
            >
                <input
                    autoComplete="on"
                    type="text"
                    className="rounded-full shadow-md px-4 py-2 w-96"
                    placeholder="Mnemonic/seed Phrase"
                    onChange={(e) => setMnemonic(e.target.value)}
                    name="mnemonic"
                />
                <input
                    name="did"
                    autoComplete="on"
                    type="text"
                    className="rounded-full shadow-md px-4 py-2 w-96"
                    placeholder="DID"
                    onChange={(e) => setDid(e.target.value)}
                />
                <button
                    className="bg-blue-500 border rounded-md px-3 py-1 text-white font-bold"
                    type="submit"
                >
                    {isLoggingIn ? "Login" : "Register"}
                </button>
                <div>
                    {isLoggingIn ? (
                        <p
                            className="hover:text-white text-lg cursor-pointer"
                            onClick={(e) => setIsLogginIn(false)}
                        >
                            Register
                        </p>
                    ) : (
                        <p
                            className="hover:text-white cursor-pointer text-lg"
                            onClick={(e) => setIsLogginIn(true)}
                        >
                            Login
                        </p>
                    )}
                </div>
            </form>
        </div>
    );
};

export default Auth;
//
