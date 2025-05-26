"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@client/components/ui/dialog";
import { Input } from "@client/components/ui/input";
import { Label } from "@client/components/ui/label";
import { Button } from "@client/components/ui/button";
import socket from "@client/requests/socketHandler";
import type { GameState, PlayMode } from "@memory-game/common";
import { RadioGroup, RadioGroupItem } from "@client/components/ui/radio-group";

type FormData = {
	gameTitle: string;
	username: string;
	cardCount: number;
	playMode: PlayMode
};

export default function CreateGameDialog() {
	const [open, setOpen] = useState(false);
	const [error, setError] = useState("");
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<FormData>({ defaultValues: { cardCount: 12, playMode: "single-player" } });
	const router = useRouter();

	const onSubmit = async (data: FormData) => {
		console.log("Form submitted", data);
		socket.emit("create-game", data);

		socket.once("game-created", (game: GameState) => {
			console.log("Game created", game);
			router.push(`/game/${game.id}?playerId=${game.players[0].id}`);
			setOpen(false);
		});

		socket.once("error", ({ message }) => {
			setError(message);
		});
	};



	return (
		<>
			{!open ? <Button type="button" variant="ghost" className="hover:bg-purple-500 hover:text-white" onClick={() => setOpen(true)}>
				<Plus className="h-6 w-6" />
				Create a Game
			</Button> :
				<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4 w-full">
					<div className="space-y-1">
						<Input
							id="gameTitle"
							placeholder="Enter game name"
							className="h-8 text-sm border-gray-400"
							{...register("gameTitle", { required: "Game name is required" })}
						/>
						{errors.gameTitle && (
							<p className="text-red-500 text-sm">{errors.gameTitle.message}</p>
						)}
					</div>
					<div className="space-y-1">
						<Input
							id="username"
							placeholder="Enter your player name"
							className="h-8 text-sm border-gray-400"
							{...register("username", { required: "Username is required" })}
						/>
						{errors.username && (
							<p className="text-red-500 text-sm">{errors.username.message}</p>
						)}
					</div>
					<div className="flex space-y-1 rounded-lg border border-gray-400 p-1">
						<RadioGroup
							defaultValue="single-player"
							onValueChange={(value: "single-player" | "multi-player") => setValue("playMode", value)}
							className="flex flex-col md:flex-row md:space-x-2"
						>
							<div className="flex items-center space-x-2 p-1 rounded-lg border border-gray-300 hover:bg-purple-200 transition-colors">
								<RadioGroupItem value="single-player" id="single-player" className="w-4 h-4" />
								<Label htmlFor="single-player" className="text-sm cursor-pointer">Single Player</Label>
							</div>
							<div className="flex items-center space-x-2 p-1 rounded-lg border border-gray-300 hover:bg-purple-200 transition-colors">
								<RadioGroupItem value="multi-player" id="multi-player" className="w-4 h-4" />
								<Label htmlFor="multi-player" className="text-sm cursor-pointer">Two Players</Label>
							</div>
						</RadioGroup>
					</div>
					<div className="flex space-y-1 rounded-lg border border-gray-400 p-1">
						<RadioGroup
							defaultValue="12"
							onValueChange={(value) => setValue("cardCount", Number(value))}
							className="flex flex-col md:flex-row md:space-x-2"
						>
							<div className="flex items-center space-x-2 p-1 rounded-lg border border-gray-300 hover:bg-purple-200 transition-colors">
								<RadioGroupItem value="12" id="card-12" className="w-4 h-4" />
								<Label htmlFor="card-12" className="text-sm cursor-pointer">Easy (12)</Label>
							</div>
							<div className="flex items-center space-x-2 p-1 rounded-lg border border-gray-300 hover:bg-purple-200 transition-colors">
								<RadioGroupItem value="16" id="card-16" className="w-4 h-4" />
								<Label htmlFor="card-16" className="text-sm cursor-pointer">Medium (16)</Label>
							</div>
							<div className="flex items-center space-x-2 p-1 rounded-lg border border-gray-300 hover:bg-purple-200 transition-colors">
								<RadioGroupItem value="24" id="card-24" className="w-4 h-4" />
								<Label htmlFor="card-24" className="text-sm cursor-pointer">Hard (24)</Label>
							</div>
						</RadioGroup>
					</div>
					<Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-2 h-9 rounded-lg transition-all duration-200">
						Create Game
					</Button>
				</form>}

		</>
	);
}
