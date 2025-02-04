"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
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

type FormData = {
	name: string;
	username: string;
};

export default function CreateGameDialog() {
	const [open, setOpen] = useState(false);
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>();

	const onSubmit = (data: FormData) => {
		console.log("Game Created:", data);
		setOpen(false); // Close the dialog after submission
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button>Create a Game</Button>
			</DialogTrigger>
			<DialogContent aria-describedby="create-game-dialog">
				<DialogHeader>
					<DialogTitle>Create a New Game</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="name">Game Name</Label>
						<Input
							id="name"
							{...register("name", { required: "Game name is required" })}
						/>
						{errors.name && (
							<p className="text-red-500 text-sm">{errors.name.message}</p>
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
