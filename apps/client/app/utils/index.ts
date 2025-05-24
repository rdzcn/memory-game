export function calculateGameDuration(
	startedAt: number | undefined,
	finishedAt: number | undefined,
): string {
	if (!startedAt || !finishedAt) {
		return "Game not finished yet";
	}
	const durationInMilliseconds = finishedAt - startedAt;
	const durationInMinutes = Math.floor(durationInMilliseconds / 60000);
	const remainingSeconds = Math.floor((durationInMilliseconds % 60000) / 1000);

	// Pad with leading zero if needed
	const formattedMinutes = durationInMinutes.toString().padStart(2, "0");
	const formattedSeconds = remainingSeconds.toString().padStart(2, "0");

	return `Finished in ${formattedMinutes}:${formattedSeconds} minutes`;
}

export function calculateRawDuration(
	startedAt: number,
	finishedAt: number,
): string {
	if (!startedAt || !finishedAt) {
		return "Game not finished yet";
	}
	const durationInMilliseconds = finishedAt - startedAt;
	const durationInMinutes = Math.floor(durationInMilliseconds / 60000);
	const remainingSeconds = Math.floor((durationInMilliseconds % 60000) / 1000);

	const formattedMinutes = durationInMinutes.toString().padStart(2, "0");
	const formattedSeconds = remainingSeconds.toString().padStart(2, "0");

	return `${formattedMinutes}:${formattedSeconds}`;
}
