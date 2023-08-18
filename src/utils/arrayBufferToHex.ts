export const arrayBufferToHex = (data: ArrayBuffer) => {
	return [...new Uint8Array(data)].map((b) => b.toString(16).padStart(2, "0")).join("");
};
