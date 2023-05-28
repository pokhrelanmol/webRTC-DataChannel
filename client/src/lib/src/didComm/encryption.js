import crypto from "crypto";

export function deriveKey(sharedSecret) {
    const hmac = crypto.createHmac("sha256", sharedSecret);
    hmac.update("Some constant value"); // This could be a nonce, for example
    return hmac.digest();
}

export function encryptMessage(message, sharedSecret, signature) {
    console.log(message, sharedSecret, signature);
    try {
        const key = deriveKey(sharedSecret);

        const iv = crypto.randomBytes(12);

        const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
        const _msg = {
            ...message,
            signature,
        };
        const encrypted = Buffer.concat([
            cipher.update(JSON.stringify(_msg), "utf8"),
            cipher.final(),
        ]);
        const tag = cipher.getAuthTag();

        console.log("Message encrypted successfully");
        return Buffer.concat([iv, tag, encrypted]);
    } catch (error) {
        console.error("Error encrypting message:", error);
        throw error;
    }
}
