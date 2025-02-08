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
import { createGame, joinGame } from "@/requests/api";

type FormData = {
	username: string;
};

export default function JoinGameDialog({ gameId }: { gameId: string }) {
	const [open, setOpen] = useState(false);
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>();
	const router = useRouter();

	const onSubmit = async (data: FormData) => {
		try {
			const { playerId: player2Id } = await joinGame({ ...data, gameId });
			console.log("player2Id", player2Id);
			router.push(`/game/${gameId}?playerId=${player2Id}`);
			setOpen(false);
		} catch (error) {
			console.error("Failed to create game", error);
		}
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
