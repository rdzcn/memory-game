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
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button>
					<Plus className="h-6 w-6" />
					Create a Game
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create a New Game</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="gameTitle">Game Name</Label>
						<Input
							id="gameTitle"
							{...register("gameTitle", { required: "Game name is required" })}
						/>
						{errors.gameTitle && (
							<p className="text-red-500 text-sm">{errors.gameTitle.message}</p>
						)}
					</div>
					<div className="space-y-2">
						<Label htmlFor="username">Your Username</Label>
						<Input
							id="username"
							{...register("username", { required: "Username is required" })}
						/>
						{errors.username && (
							<p className="text-red-500 text-sm">{errors.username.message}</p>
						)}
					</div>
					<div className="space-y-2">
						<Label>Choose Play Mode</Label>
						<RadioGroup
							defaultValue="single-player"
							onValueChange={(value: "single-player" | "multi-player") => setValue("playMode", value)}
							className="flex gap-4"
						>
							<div className="flex items-center space-x-2">
								<RadioGroupItem value="single-player" id="single-player" />
								<Label htmlFor="single-player">Single Player</Label>
							</div>
							<div className="flex items-center space-x-2">
								<RadioGroupItem value="multi-player" id="multi-player" />
								<Label htmlFor="multi-player">Two Players</Label>
							</div>
						</RadioGroup>
					</div>
					<div className="space-y-2">
						<Label>Choose Difficulty Level</Label>
						<RadioGroup
							defaultValue="12"
							onValueChange={(value) => setValue("cardCount", Number(value))}
							className="flex gap-4"
						>
							<div className="flex items-center space-x-2">
								<RadioGroupItem value="12" id="card-12" />
								<Label htmlFor="card-12">Easy (12 pairs)</Label>
							</div>
							<div className="flex items-center space-x-2">
								<RadioGroupItem value="16" id="card-16" />
								<Label htmlFor="card-16">Medium (16 pairs)</Label>
							</div>
							<div className="flex items-center space-x-2">
								<RadioGroupItem value="24" id="card-24" />
								<Label htmlFor="card-24">Hard (24 pairs)</Label>
							</div>
						</RadioGroup>
					</div>
					<Button type="submit">
						Create Game
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
}
