"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
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
import type { GameState } from "@common/types";

type FormData = {
	gameTitle: string;
	username: string;
};

export default function CreateGameDialog() {
	const [open, setOpen] = useState(false);
	const [error, setError] = useState("");
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>();
	const router = useRouter();

	const onSubmit = async (data: FormData) => {
		socket.emit("create-game", data);

		socket.once("game-created", (game: GameState) => {
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
				<Button>Create a Game</Button>
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
					<Button type="submit">Create Game</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
}
