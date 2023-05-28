import React, { useState } from "react";
import axios from "axios";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { logIn, register } from "../services/Auth";
import { generateKeypairs } from "../services/kilt/keyAggrement";
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
        <div className="flex flex-col h-screen justify-center bg-gray-300 p-2 items-center gap-2 ">
            <h1 className="text-xl">{isLoggingIn ? "Login" : "Register"}</h1>
            <form
                className="flex flex-col gap-3"
                action=""
                onSubmit={isLoggingIn ? loginUser : registerUser}
            >
                <input
                    autoComplete="on"
                    type="text"
                    className="border p-2 w-96"
                    placeholder="Mnemonic/seed Phrase"
                    onChange={(e) => setMnemonic(e.target.value)}
                    name="mnemonic"
                />
                <input
                    name="did"
                    autoComplete="on"
                    type="text"
                    className="border p-2"
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
                            className="hover:text-blue-500 cursor-pointer"
                            onClick={(e) => setIsLogginIn(false)}
                        >
                            Register
                        </p>
                    ) : (
                        <p
                            className="hover:text-blue-500 cursor-pointer"
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
