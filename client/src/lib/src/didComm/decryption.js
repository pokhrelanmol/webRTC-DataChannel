import { createDecipheriv } from "crypto-browserify";
import { deriveKey } from "./encryption";
export function decryptMessage(encrypted, sharedSecret) {
    try {
        const key = deriveKey(sharedSecret);

        const iv = encrypted.subarray(0, 12);

        const tag = encrypted.subarray(12, 28);

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
