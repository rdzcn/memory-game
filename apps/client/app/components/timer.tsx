import { useEffect, useState } from "react";

const CountUp = ({ updatedAt }: { updatedAt: number }) => {
	const [elapsedTime, setElapsedTime] = useState(0);

	useEffect(() => {
		if (!updatedAt) return;

		const startTime = new Date(updatedAt).getTime();
		const updateTimer = () => {
			const now = Date.now();
			setElapsedTime(Math.floor((now - startTime) / 1000)); // Convert to seconds
		};

		updateTimer();
		const interval = setInterval(updateTimer, 1000);

		return () => clearInterval(interval);
	}, [updatedAt]);

	return <div>Elapsed Time: {elapsedTime}s</div>;
};

export default CountUp;