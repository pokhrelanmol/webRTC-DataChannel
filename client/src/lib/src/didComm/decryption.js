import { createDecipheriv } from "crypto-browserify";
import { deriveKey } from "./encryption";
export function decryptMessage(encrypted, sharedSecret) {
    console.log("decrypting message", encrypted);
    console.log("decrypting message data", encrypted.data);
    try {
        const key = deriveKey(sharedSecret);
        console.log("key decrypting", key);

        const iv = encrypted.subarray(0, 12);
        console.log("iv decrypting", iv);

        const tag = encrypted.subarray(12, 28);
        console.log("tag decrypting", tag);

        const text = encrypted.subarray(28);
        const decipher = createDecipheriv("aes-256-gcm", key, iv);
        decipher.setAuthTag(tag);
        const decrypted = decipher.update(text) + decipher.final("utf8");
        console.log("Message decrypted successfully");
        return JSON.parse(decrypted);
    } catch (error) {
        console.error("Error decrypting message:", error);
        throw error;
    }
}
