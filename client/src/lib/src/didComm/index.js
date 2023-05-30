import { waitReady } from "@polkadot/wasm-crypto";
import { encryptMessage } from "./encryption";
import { decryptMessage } from "./decryption";
import { signMessage, verifyMessageSignature } from "./signing";
import { deriveSharedSecret } from "../kilt/secretResolver";
import nacl from "tweetnacl";
import { generateKeypairs } from "../kilt/keyAggrement";

// Send a DIDComm message
export async function sendMessage(
    message,
    receiverPublicKey,
    senderPrivateKey,
    seed,
    senderDID
) {
    try {
        // Sign the message
        await waitReady();
        const { authentication } = generateKeypairs(seed);
        const signature = await signMessage(
            message,
            async ({ data }) => ({
                signature: authentication.sign(data),
                keyType: authentication.type,
            }),
            senderDID
        );
        // Generate a random nonce
        const nonce = nacl.randomBytes(nacl.box.nonceLength);
        console.log("nonce encrypting", nonce);
        // Encrypt the message and the signature using the nonce

        const sharedSecretUint8Array = deriveSharedSecret(
            senderPrivateKey,
            receiverPublicKey,
            nonce
        );
        const sharedSecret = Buffer.from(sharedSecretUint8Array); //why convert to buffer?
        const encrypted = encryptMessage({ ...message }, sharedSecret);
        console.log("This is the encrypted message:", encrypted);

        console.log("Message sent successfully");
        return { encrypted, nonce };
    } catch (error) {
        console.error("Error sending message:", error);
        throw error;
    }
}

// Receive a DIDComm message
export async function receiveMessage(
    encrypted,
    receiverPrivateKey,
    senderPublicKey,
    nonce
) {
    try {
        // Decrypt the message using the provided nonce
        const sharedSecretUint8Array = deriveSharedSecret(
            receiverPrivateKey,
            senderPublicKey,
            nonce
        );

        const sharedSecret = Buffer.from(sharedSecretUint8Array);
        console.log("This is the shared secret:", sharedSecret);
        console.log("This is the encrypted message:", encrypted);
        const message = decryptMessage(encrypted, sharedSecret);

        // Verify the signature

        console.log("Message received successfully");
        return message;
    } catch (error) {
        console.error("Error receiving message:", error);
        throw error;
    }
}
