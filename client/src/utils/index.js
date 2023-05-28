export const formatDid = (did) => {
    return did.slice(0, 8) + "..." + did.slice(-4);
};
