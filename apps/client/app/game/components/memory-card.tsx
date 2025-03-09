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
				<div className="w-24 h-24 border border-gray-300 rounded-md flex items-center justify-center aspect-[4/3] relative overflow-hidden">
					{isFlipped ? (
						<Image
							src={`/images/${value}.svg`}
							alt="memory-card"
							className="object-contain w-full h-full"
							fill
						/>
					) : (
						<Image
							src="/images/pokeball.svg"
							alt="placeholder"
							width={96}
							height={96}
						/>
					)}
				</div>
			</button>
		</>
	);
}
