import { useEffect, useState } from 'react';
import { createAnimal, deleteAnimal, listAnimals, updateAnimal, type Animal } from '../api/animals';
import { listBreeds, type Breed } from '../api/breeds';

export function AnimalsPage() {
	const [items, setItems] = useState<Animal[]>([]);
	const [sex, setSex] = useState("");
	const [nickname, setNickname] = useState("");
	const [arrivedAt, setArrivedAt] = useState("");
	const [age, setAge] = useState<number | null>(null);
	const [breeds, setBreeds] = useState<Breed[]>([]);
	const [breedId, setBreedId] = useState<number | null>(null);
	const [parent, setParent] = useState<string | null>(null);
	const [editingInventoryNumber, setEditingInventoryNumber] = useState<number | null>(null);
	const [editSex, setEditSex] = useState("");
	const [editNickname, setEditNickname] = useState("");
	const [editArrivedAt, setEditArrivedAt] = useState("");
	const [editAge, setEditAge] = useState<number | null>(null);
	const [editBreedId, setEditBreedId] = useState<number | null>(null);
	const [editParent, setEditParent] = useState<string | null>(null);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(true);

	async function load() {
		setError("");
		setLoading(true);
		try {
			setItems(await listAnimals());
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
		listBreeds().then(setBreeds);
	}, []);

	async function handleCreate(event: SubmitEvent) {
		event.preventDefault();
		if (!sex.trim() ||
		!nickname.trim() ||
		!arrivedAt ||
		(!age || age == null) ||
		!breedId
		) return;
		setError("");
		try {
			await createAnimal({
				sex: sex.trim(),
				nickname: nickname.trim(),
				arrived_at: arrivedAt,
				age: age,
				breed_id: breedId,
				parent: parent?.trim() || null
			});
			setSex("");
			setNickname("");
			setArrivedAt("");
			setAge(null);
			setBreedId(null);
			setParent("");
			await load();
		} catch (error) {
			setError(error instanceof Error ? error.message : "Ошибка создания");
		}
	}

	function startEdit(item: Animal) {
		setEditingInventoryNumber(item.inventory_number);
		setEditSex(item.sex);
		setEditNickname(item.nickname);
		setEditArrivedAt(item.arrived_at);
		setEditAge(item.age);
		setEditBreedId(item.breed_id);
		setEditParent(item.parent);
	}

	function cancelEdit() {
		setEditingInventoryNumber(null);
		setEditSex("");
		setEditNickname("");
		setEditArrivedAt("");
		setEditAge(null);
		setEditBreedId(null);
		setEditParent("");
	}

	async function saveEdit(inventory_number: number) {
		if (!editSex ||
			!editNickname.trim() ||
			!editArrivedAt ||
			(!editAge || editAge == null) ||
			!editBreedId
		) return;
		setError("");
		try {
			await updateAnimal(inventory_number, {
				sex: editSex.trim(),
				nickname: editNickname.trim(),
				arrived_at: editArrivedAt,
				age: editAge,
				breed_id: editBreedId,
				parent: editParent?.trim() || null
			});
			cancelEdit();
			await load();
		} catch (error) {
			setError(error instanceof Error ? error.message : "Ошибка сохранения")
		}
	}

	async function handleDelete(inventory_number: number) {
		if (!confirm("Удалить животного?")) return;
		setError("");
		try {
			await deleteAnimal(inventory_number);
			await load();
		} catch (error) {
			setError(error instanceof Error ? error.message : "Ошибка удаления");
		}
	}

	return (
		<div>
			<h1>Животные</h1>
			{error && <p style={{ color: "red "}}>{error}</p>}

			<form onSubmit={handleCreate}>
				<input 
					value={sex}
					onChange={(e) => setSex(e.target.value)}
					placeholder="Пол"
				/>
				<input 
					value={nickname}
					onChange={(e) => setNickname(e.target.value)}
					placeholder="Кличка"
				/>
				<input
					type="date"
					value={arrivedAt}
					onChange={(e) => setArrivedAt(e.target.value)}
					placeholder="Дата прибытия"
				/>
				<input 
					value={age}
					onChange={(e) => setAge(Number(e.target.value))}
					placeholder="Возраст"
				/>
				<select
					value={breedId ?? ""}
					onChange={(e) => setBreedId(Number(e.target.value))}
					required
				>
					<option value="" disabled>Выберите породу</option>
					{breeds.map((t) => (
						<option key={t.id} value={t.id}>{t.name}</option>
					))}
				</select>
				<input
					value={parent ?? ""}
					onChange={(e) => setParent(e.target.value)}
					placeholder="Информация о родителе"
				/>
				<button type="submit">Создать</button>
			</form>
			
			{loading ? (
				<p>Загрузка...</p>
			) : (
				<table>
					<thead>
						<tr>
							<th>Инвентарный номер</th>
							<th>Пол</th>
							<th>Кличка</th>
							<th>Дата прибытия</th>
							<th>Возраст</th>
							<th>Порода</th>
							<th>Информация о родителе</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{items.map((item) => (
							<tr key={item.inventory_number}>
								<td>{item.inventory_number}</td>
								<td>
									{editingInventoryNumber === item.inventory_number ? (
										<input 
											value={editSex}
											onChange={(e) => setEditSex(e.target.value)}
										/>
									): (
										item.sex
									)}
								</td>
								<td>
									{editingInventoryNumber === item.inventory_number ? (
										<input 
											value={editNickname}
											onChange={(e) => setEditNickname(e.target.value)}
										/>
									): (
										item.nickname
									)}
								</td>
								<td>
									{editingInventoryNumber === item.inventory_number ? (
										<input 
											type="date"
											value={editArrivedAt}
											onChange={(e) => setEditArrivedAt(e.target.value)}
										/>
									): (
										item.arrived_at
									)}
								</td>
								<td>
									{editingInventoryNumber === item.inventory_number ? (
										<input 
											value={editAge}
											onChange={(e) => setEditAge(Number(e.target.value))}
										/>
									): (
										item.age
									)}
								</td>
								<td>
									{editingInventoryNumber === item.inventory_number ? (
										<select 
											value={editBreedId ?? ""} 
											onChange={(e) => setEditBreedId(Number(e.target.value))}
											required
										>
											<option value="" disabled>Выберите породу</option>
											{breeds.map((t) => (
												<option key={t.id} value={t.id}>{t.name}</option>
											))}
										</select>
									) : (
										item.breed_id
									)}
								</td>
								<td>
									{editingInventoryNumber === item.inventory_number ? (
										<input 
											value={editParent ?? ""}
											onChange={(e) => setEditParent(e.target.value)}
										/>
									): (
										item.parent
									)}
								</td>
								<td>
									{editingInventoryNumber === item.inventory_number ? (
										<>
											<button type="button" onClick={() => saveEdit(item.inventory_number)}>
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
											<button type="button" onClick={() => handleDelete(item.inventory_number)}>
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