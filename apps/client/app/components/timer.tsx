import { useEffect, useState } from "react";

const CountUp = ({ startedAt }: { startedAt: number }) => {
	const [elapsedTime, setElapsedTime] = useState(0);

	useEffect(() => {
		if (!startedAt) return;

		const startTime = new Date(startedAt).getTime();
		const updateTimer = () => {
			const now = Date.now();
			setElapsedTime(Math.floor((now - startTime) / 1000)); // Convert to seconds
		};

		updateTimer();
		const interval = setInterval(updateTimer, 1000);

		return () => clearInterval(interval);
	}, [startedAt]);

	return <div>Elapsed Time: {elapsedTime}s</div>;
};

export default CountUp;