import { useEffect, useState } from 'react';
import { createBreed, deleteBreed, listBreeds, updateBreed, type Breed } from '../api/breeds';
import { type AnimalType, listAnimalTypes } from '../api/animalTypes';

export function BreedsPage() {
	const [items, setItems] = useState<Breed[]>([]);
	const [animalTypes, setAnimalTypes] = useState<AnimalType[]>([]);
	const [animalTypeId, setAnimalTypeId] = useState<number | null>(null);
	const [name, setName] = useState("");
	const [editingId, setEditingId] = useState<number | null>(null);
	const [editName, setEditName] = useState("");
	const [editAnimalTypeId, setEditAnimalTypeId] = useState<number | null>(null);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(true);

	async function load() {
		setError("");
		setLoading(true);
		try {
			setItems(await listBreeds());
		} catch (error) {
			setError(error instanceof Error ? error.message : "Ошибка загрузки")
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		 load();
	}, []);

	useEffect(() => {
		listAnimalTypes().then(setAnimalTypes);
	}, []);

	async function handleCreate(event: SubmitEvent) {
		event.preventDefault();
		if (!name.trim()) return;
		if (!animalTypeId) return;
		setError("");
		try {
			await createBreed({
				name: name.trim(),
				animaltype_id: animalTypeId
			});
			setName("");
			setAnimalTypeId(null);
			await load();
		} catch (error) {
			setError(error instanceof Error ? error.message : "Ошибка создания");
		}
	}

	function startEdit(item: Breed) {
		setEditingId(item.id);
		setEditName(item.name);
		setEditAnimalTypeId(item.animaltype_id);
	}

	function cancelEdit() {
		setEditingId(null);
		setEditName("");
		setEditAnimalTypeId(null);
	}

	async function saveEdit(id: number) {
		if (!editName.trim()) return;
		if (!editAnimalTypeId) return
		setError("");
		try {
			await updateBreed(id, {
				name: editName.trim(),
				animaltype_id: editAnimalTypeId
			});
			cancelEdit();
			await load();
		} catch (error) {
			setError(error instanceof Error ? error.message : "Ошибка сохранения")
		}
	}

	async function handleDelete(id: number) {
		if (!confirm("Удалить породу?")) return;
		setError("");
		try {
			await deleteBreed(id);
			await load();
		} catch (error) {
			setError(error instanceof Error ? error.message : "Ошибка удаления");
		}
	}

	return (
		<div>
			<h1>Породы</h1>
			{error && <p style={{ color: "red "}}>{error}</p>}

			<form onSubmit={handleCreate}>
				<input 
					value={name}
					onChange={(e) => setName(e.target.value)}
					placeholder="Название"
				/>
				<select
					value={animalTypeId ?? ""}
					onChange={(e) => setAnimalTypeId(Number(e.target.value))}
					required
				>
					<option value="" disabled>Выберите тип</option>
					{animalTypes.map((t) => (
						<option key={t.id} value={t.id}>{t.name}</option>
					))}
				</select>
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
							<th>Тип животного</th>
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
										<select 
											value={animalTypeId ?? ""} 
											onChange={(e) => setAnimalTypeId(Number(e.target.value))}
											required
										>
											<option value="" disabled>Выберите тип</option>
											{animalTypes.map((t) => (
												<option key={t.id} value={t.id}>{t.name}</option>
											))}
										</select>
									) : (
										item.animaltype_id
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