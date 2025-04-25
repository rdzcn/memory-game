export type PlayMode = "single-player" | "multi-player";

export type CreateGameData = {
	username: string;
	gameTitle: string;
	cardCount: number;
	playMode: PlayMode;
};

export type JoinGameData = {
	gameId: string;
	username: string;
};

export type LeaveGameData = {
	gameId: string;
	playerId: string;
};

export type FlipCardData = {
	gameId: string;
	id: number;
	playerId: string;
};

export type SwitchTurnData = {
	gameId: string;
};

export type WatchGameData = {
	gameId: string;
};

export type RegisterSocketData = {
	gameId: string;
	playerId: string;
};

export type UnregisterSocketData = {
	gameId: string;
};

export type HeartbeatData = {
	gameId: string;
	playerId: string;
};

export type RequestGameStateData = {
	gameId: string;
};
