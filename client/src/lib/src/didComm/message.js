import { v4 as uuidv4 } from "uuid";

// Create a new DIDComm message
export function createMessage(
    type,
    body,
    from,
    to,
    created_time,
    expires_time
) {
    return {
        id: uuidv4(),
        type: type,
        body: body,
        from: from,
        to: to,
        created_time: created_time,
        expires_time: expires_time,
    };
}

// Parse a DIDComm message from a string
export function parseMessage(messageString) {
    const message = JSON.parse(messageString);
    if (!message.id || !message.type || !message.body) {
        throw new Error("Invalid DIDComm message");
    }
    return message;
}

// Validate a DIDComm message
export function validateMessage(message) {
    return !!message.id && !!message.type && !!message.body;
}
