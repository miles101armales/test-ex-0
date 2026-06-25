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
		const error = await res.json().catch(() => ({}));
		const detail = error.detail;
		const message = Array.isArray(detail)
			? detail.map((d: { msg: string }) => d.msg).join(", ")
			: typeof detail === "string"
				? detail
				: res.statusText;
		throw new Error(message);
	}

	if (res.status === 204) return undefined as T;
	return res.json();
}