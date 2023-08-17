export const streamToArrayBuffer = async (stream: ReadableStream, streamSize: number) => {
	let result = new Uint8Array(streamSize);
	let bytesRead = 0;

	const reader = stream.getReader();
	while (true) {
		const { done, value } = await reader.read();
		if (done) {
			break;
		}
		result.set(value, bytesRead);
		bytesRead += value.length;
	}

	return result;
};
