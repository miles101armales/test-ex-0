import { getToken, clearToken } from '../auth/token';

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export async function api<T>(
	path: string,
	options: RequestInit = {}
): Promise<T> {
	const token = getToken();

	const res = await fetch(`${API_URL}${path}`, {
		...options,
		headers: {
			"Content-Type": "application/json",
			...(token ? { Authorization: `Bearer ${token}` } : {}),
			...options.headers,
		},
	});

	if (res.status === 401) {
		clearToken();
		window.location.href = "/login";
		throw new Error("Unauthorized");
	}

	if (!res.ok) {
		const err = await res.json().catch(() => ({}));
		throw new Error(err.detail ?? res.statusText);
	}

	if (res.status === 204) return undefined as T;
	return res.json();
}