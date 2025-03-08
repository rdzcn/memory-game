"use client";

import type { Card } from "@common/types";
import Image from "next/image";

interface MemoryCardProps {
	card: Card;
	flippedCards: Card[];
	handleFlipCard: ({ id }: { id: number }) => void;
}

export function MemoryCard({
	card,
	flippedCards,
	handleFlipCard,
}: MemoryCardProps) {
	const { id, value, isFlipped, isMatched } = card;

	const handleButtonClick = () => {
		handleFlipCard({ id });
	};

	return (
		<>
			<button type="button" onClick={handleButtonClick}>
				{isFlipped ? (
					<div>
						<Image
							src={`/images/${value}.png`}
							alt="memory-card"
							width={96}
							height={96}
						/>
					</div>
				) : (
					<div>
						<Image
							src="/images/flip.png"
							alt="placeholder"
							width={96}
							height={96}
						/>
					</div>
				)}
			</button>
		</>
	);
}
