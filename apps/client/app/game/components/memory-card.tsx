"use client";

import Image from "next/image";
import type { CardData } from "../data/cards";

interface MemoryCardProps {
	card: CardData;
	flippedCards: CardData[];
	handleFlipCard: ({
		id,
		pairIndex,
	}: { id: string; pairIndex: number }) => void;
}

export function MemoryCard({
	card,
	flippedCards,
	handleFlipCard,
}: MemoryCardProps) {
	const { id, pairIndex } = card;
	const isFlipped = flippedCards.find(
		(flippedCard) =>
			flippedCard.id === card.id && flippedCard.pairIndex === card.pairIndex,
	);

	return (
		<>
			<li
				onClick={() => handleFlipCard({ id, pairIndex })}
				onKeyUp={() => handleFlipCard({ id, pairIndex })}
			>
				{isFlipped ? (
					<div>
						<Image src={card.src} alt={card.id} width={96} height={96} />
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
			</li>
		</>
	);
}
