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
} from "@client/components/ui/dialog";
import { Input } from "@client/components/ui/input";
import { Label } from "@client/components/ui/label";
import { Button } from "@client/components/ui/button";
import socket from "@client/requests/socketHandler";

type FormData = {
	username: string;
};

export default function JoinGameDialog({ gameId }: { gameId: string }) {
	const [open, setOpen] = useState(false);
	const [error, setError] = useState("");
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>();
	const router = useRouter();

	const onSubmit = async (data: FormData) => {
		socket.emit("join-game", { ...data, gameId });

		socket.once("player-joined", (playerId: string) => {
			router.push(`/game/${gameId}?playerId=${playerId}`);
			setOpen(false);
		});

		socket.once("error", ({ message }) => {
			setError(message);
		});
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button>Join Game</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Join Game</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
					<Button type="submit">Join Game</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
}
