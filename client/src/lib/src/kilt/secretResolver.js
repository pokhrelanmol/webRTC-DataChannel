import nacl from "tweetnacl";

export function deriveSharedSecret(privateKeyA, publicKeyB, nonce) {
    // Convert keys to Uint8Array if they are not already
    const privateKeyBytes = new Uint8Array(privateKeyA);
    const publicKeyBytes = new Uint8Array(publicKeyB);
    const nonceBytes = Uint8Array.from(Object.values(nonce));

    // Encrypt an empty message to derive the shared secret
    const emptyMessage = new Uint8Array(0);
    const box = nacl.box(
        emptyMessage,
        nonceBytes,
        publicKeyBytes,
        privateKeyBytes
    );
    console.log("This is the box used in deriveSharedSecret:", box);

    // The "box" now contains the encrypted version of our empty message,
    // which serves as the shared secret.
    return box;
}
