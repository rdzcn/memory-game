"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Card } from "@common/types";

interface MemoryCardProps {
	card: Card;
	handleFlipCard: ({ id }: { id: number }) => void;
}

export function MemoryCard({
	card,
	handleFlipCard,
}: MemoryCardProps) {
	const { id, value, isFlipped, isMatched } = card;

	const handleButtonClick = () => {
		handleFlipCard({ id });
	};

	return (
		<>
			<button type="button" onClick={handleButtonClick}>
				<div className="w-24 h-24 flex items-center justify-center aspect-[4/3] relative overflow-hidden">
					<motion.div
						className="relative w-full h-full transition-transform duration-500 transform-style-3d preserve-3d"
						initial={false}
						animate={{
							rotateY: isFlipped || isMatched ? 180 : 0,
						}}
						transition={{ duration: 0.1, ease: "easeOut" }}
					>
						{/* Card Back */}
						<div
							className={cn(
								"absolute w-full h-full backface-hidden rounded-xl shadow-md flex items-center justify-center",
								"bg-gradient-to-br from-blue-500 to-purple-600 border-4 border-white"
							)}
						>
							<Image src="/images/pokeball.svg" alt="placeholder" width={96} height={96} />
						</div>

						{/* Card Front */}
						<div
							className={cn(
								"absolute w-full h-full backface-hidden rounded-xl shadow-md flex items-center justify-center",
								"bg-white border-4",
								card.isMatched ? "border-green-300 bg-green-50" : "border-yellow-300",
								"rotate-y-180"
							)}
						>
							<Image
								src={`/images/${value}.svg`}
								alt="memory-card"
								className="object-contain w-full h-full"
								fill
							/>
						</div>
					</motion.div>
				</div>
			</button>
		</>
	);
}
