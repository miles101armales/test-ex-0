import { useEffect, useState } from "react";
import { listUsers, setUserEnabled, type User } from "../api/users";
import { CrudPageLayout, DataTable, type Column } from "../components/table";

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

	const columns: Column<User>[] = [
		{ id: 'id', header: 'ID', cell: (user) => user.id },
		{ id: 'login', header: 'Login', cell: (user) => user.login },
		{ id: 'email', header: 'Email', cell: (user) => user.email },
		{ id: 'role', header: 'Роль', cell: (user) => user.role },
		{ id: 'is_active', header: 'Активен', cell: (user) => (user.is_active ? "да" : "нет") },
		{ id: 'is_enabled', header: 'Включён', cell: (user) => (user.is_enabled ? "да" : "нет") },
	];

	return (
		<CrudPageLayout title="Пользователи" error={error}>
			<DataTable
				loading={loading}
				data={items}
				columns={columns}
				getRowKey={(user) => user.id}
				actions={(user) => (
					<button
						type="button"
						className="rounded-md bg-gray-100 px-2 py-1 text-sm hover:bg-gray-200"
						onClick={() => toggleEnabled(user)}
					>
						{user.is_enabled ? "Отключить" : "Включить"}
					</button>
				)}
			/>
		</CrudPageLayout>
	);
}
