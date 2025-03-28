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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import socket from "@/requests/socketHandler";
import type { GameState } from "@/types/game.types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type FormData = {
	gameTitle: string;
	username: string;
	cardCount: number;
};

export default function CreateGameDialog() {
	const [open, setOpen] = useState(false);
	const [error, setError] = useState("");
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<FormData>({ defaultValues: { cardCount: 12 } });
	const router = useRouter();

	const onSubmit = async (data: FormData) => {
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
								<RadioGroupItem value="18" id="card-18" />
								<Label htmlFor="card-18">Medium (18 pairs)</Label>
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
