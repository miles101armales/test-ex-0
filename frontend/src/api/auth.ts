import { api } from './client';

export type LoginResponse = { access_token: string; token_type: string };
export type RegisterResponse = { message: string }

export function login(login: string, password: string) {
	return api<LoginResponse>("/auth/login", {
		method: "POST",
		body: JSON.stringify({ login, password }),
	});
}

export function register(data: { login: string; email: string; password: string }) {
	return api<RegisterResponse>("/auth/register", { method: "POST", body: JSON.stringify(data) });
}