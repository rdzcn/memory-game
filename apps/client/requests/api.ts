import axios from "axios";
import type { AxiosRequestConfig } from "axios";
import type { Game } from "@common/types";

// Create an Axios instance
export const axiosInstance = axios.create({
	baseURL: "http://localhost:4040",
	timeout: 60000,
	headers: {
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
		"Content-Type": "application/json",
	},
});

// Request interceptor to add Bearer token
axiosInstance.interceptors.request.use(
	(config) => {
		return config;
	},
	(error): Promise<unknown> => {
		return Promise.reject(error);
	},
);

// Response interceptor to handle errors
axiosInstance.interceptors.response.use(
	async (response) => {
		return response.data;
	},

	async (error): Promise<unknown> => {
		if (!error?.response) {
			throw error;
		}
		return Promise.reject({
			data: error.response.data,
			status: error.response.status,
			statusText: error.response.statusText,
		});
	},
);

//REQUESTS
export const sendRequest = <T, R>(config: AxiosRequestConfig) => {
	return axiosInstance.request<T, R>(config);
};

export function sendGetJson<T, R>(path: string) {
	return sendRequest<T, R>({
		url: path,
		method: "get",
	});
}

export function sendPostJson<T, R>(path: string, data?: unknown) {
	return sendRequest<T, R>({
		url: path,
		method: "post",
		data: JSON.stringify(data),
		headers: {
			"Content-Type": "application/json",
		},
	});
}

//API CALLS
export function createGame({
	username,
	gameTitle,
}: { username: string; gameTitle: string }) {
	return sendPostJson<unknown, Game>("/games/create", { username, gameTitle });
}

export function joinGame({
	username,
	gameId,
}: { username: string; gameId: string }) {
	return sendPostJson<unknown, Game>("/games/join", { username, gameId });
}

export function getGames() {
	return sendGetJson<unknown, Game[]>("/games");
}

export function getGameById(gameId: string) {
	return sendGetJson<unknown, Game>(`/games/${gameId}`);
}
