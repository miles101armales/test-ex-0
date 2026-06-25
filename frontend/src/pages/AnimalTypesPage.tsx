import { useEffect, useState } from 'react';
import { createAnimalType, deleteAnimalType, listAnimalTypes, updateAnimalType, type AnimalType } from '../api/animalTypes';

export function AnimalTypesPage() {
	const [items, setItems] = useState<AnimalType[]>([]);
	const [name, setName] = useState("");
	const [editingId, setEditingId] = useState<number | null>(null);
	const [editName, setEditName] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(true);

	async function load() {
		setError("");
		setLoading(true);
		try {
			setItems(await listAnimalTypes());
		} catch (error) {
			setError(error instanceof Error ? error.message : "Ошибка загрузки")
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		 load();
	}, []);

	async function handleCreate(event: React.SubmitEvent) {
		event.preventDefault();
		if (!name.trim()) return;
		setError("");
		try {
			await createAnimalType(name.trim());
			setName("");
			await load();
		} catch (error) {
			setError(error instanceof Error ? error.message : "Ошибка создания");
		}
	}

	function startEdit(item: AnimalType) {
		setEditingId(item.id);
		setEditName(item.name);
	}

	function cancelEdit() {
		setEditingId(null);
		setEditName("");
	}

	async function saveEdit(id: number) {
		if (!editName.trim()) return;
		setError("");
		try {
			await updateAnimalType(id, editName.trim());
			cancelEdit();
			await load();
		} catch (error) {
			setError(error instanceof Error ? error.message : "Ошибка сохранения")
		}
	}

	async function handleDelete(id: number) {
		if (!confirm("Удалить тип животного?")) return;
		setError("");
		try {
			await deleteAnimalType(id);
			await load();
		} catch (error) {
			setError(error instanceof Error ? error.message : "Ошибка удаления");
		}
	}

	return (
		<div>
			<h1>Типы животных</h1>
			{error && <p style={{ color: "red "}}>{error}</p>}

			<form onSubmit={handleCreate}>
				<input 
					value={name}
					onChange={(e) => setName(e.target.value)}
					placeholder="Название"
				/>
				<button type="submit">Создать</button>
			</form>
			
			{loading ? (
				<p>Загрузка...</p>
			) : (
				<table>
					<thead>
						<tr>
							<th>ID</th>
							<th>Название</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{items.map((item) => (
							<tr key={item.id}>
								<td>{item.id}</td>
								<td>
									{editingId === item.id ? (
										<input 
											value={editName}
											onChange={(e) => setEditName(e.target.value)}
										/>
									): (
										item.name
									)}
								</td>
								<td>
									{editingId === item.id ? (
										<>
											<button type="button" onClick={() => saveEdit(item.id)}>
												Сохранить
											</button>
											<button type="button" onClick={cancelEdit}>
												Отмена
											</button>
										</>
									) : (
										<>
											<button type="button" onClick={() => startEdit(item)}>
												Изменить
											</button>
											<button type="button" onClick={() => handleDelete(item.id)}>
												Удалить
											</button>
										</>
									)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</div>
	)
}