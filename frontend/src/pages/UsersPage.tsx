import { useEffect, useState } from "react";
import { listUsers, setUserEnabled, type User } from "../api/users";

export function UsersPage() {
	const [items, setItems] = useState<User[]>([]);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(true);

	async function load() {
		setError("");
		setLoading(true);
		try {
			setItems(await listUsers());
		} catch (e) {
			setError(e instanceof Error ? e.message : "Ошибка загрузки");
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		load();
	}, []);

	async function toggleEnabled(user: User) {
		setError("");
		try {
			await setUserEnabled(user.id, !user.is_enabled);
			await load();
		} catch (e) {
			setError(e instanceof Error ? e.message : "Ошибка");
		}
	}

	return (
		<div>
		<h1>Пользователи</h1>
		{error && <p style={{ color: "red" }}>{error}</p>}

		{loading ? (
			<p>Загрузка...</p>
		) : (
			<table>
			<thead>
				<tr>
				<th>ID</th>
				<th>Login</th>
				<th>Email</th>
				<th>Роль</th>
				<th>Активен</th>
				<th>Включён</th>
				<th></th>
				</tr>
			</thead>
			<tbody>
				{items.map((user) => (
				<tr key={user.id}>
					<td>{user.id}</td>
					<td>{user.login}</td>
					<td>{user.email}</td>
					<td>{user.role}</td>
					<td>{user.is_active ? "да" : "нет"}</td>
					<td>{user.is_enabled ? "да" : "нет"}</td>
					<td>
					<button type="button" onClick={() => toggleEnabled(user)}>
						{user.is_enabled ? "Отключить" : "Включить"}
					</button>
					</td>
				</tr>
				))}
			</tbody>
			</table>
		)}
		</div>
	);
}