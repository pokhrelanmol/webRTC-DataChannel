import nacl from "tweetnacl";

export function deriveSharedSecret(privateKeyA, publicKeyB, nonce) {
    privateKeyA = privateKeyA;
    publicKeyB = publicKeyB;
    // Convert keys to Uint8Array if they are not already
    if (!(privateKeyA instanceof Uint8Array)) {
        privateKeyA = Uint8Array.from(privateKeyA);
    }
    if (!(publicKeyB instanceof Uint8Array)) {
        publicKeyB = Uint8Array.from(publicKeyB);
    }
    // Encrypt an empty message to derive the shared secret
    const emptyMessage = new Uint8Array(0);
    const box = nacl.box(emptyMessage, nonce, publicKeyB, privateKeyA);
    console.log("This is the box used in deriveSharedSecret:", box);

    // The "box" now contains the encrypted version of our empty message,
    // which serves as the shared secret.
    return box;
}
