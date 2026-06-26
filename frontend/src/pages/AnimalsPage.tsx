import { type FormEvent, useEffect, useState } from 'react';
import { createAnimal, deleteAnimal, listAnimals, updateAnimal, type Animal, type Sex } from '../api/animals';
import { listBreeds, type Breed } from '../api/breeds';
import { btnPrimary, inputClass } from '../App';
import { CrudPageLayout, DataTable, RowActions, type Column } from '../components/table';

const sexOptions: { value: Sex; label: string }[] = [
	{ value: "MEN", label: "Мужской" },
	{ value: "WOMEN", label: "Женский" },
];

const sexLabels: Record<Sex, string> = {
	MEN: "Мужской",
	WOMEN: "Женский",
};

export function AnimalsPage() {
	const [items, setItems] = useState<Animal[]>([]);
	const [sex, setSex] = useState<Sex | null>(null);
	const [nickname, setNickname] = useState("");
	const [arrivedAt, setArrivedAt] = useState("");
	const [age, setAge] = useState<number | null>(null);
	const [breeds, setBreeds] = useState<Breed[]>([]);
	const [breedId, setBreedId] = useState<number | null>(null);
	const [parent, setParent] = useState<string | null>(null);
	const [editingInventoryNumber, setEditingInventoryNumber] = useState<number | null>(null);
	const [editSex, setEditSex] = useState<Sex | null>(null);
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
		 void Promise.resolve().then(load);
	}, []);

	useEffect(() => {
		listBreeds().then(setBreeds);
	}, []);

	async function handleCreate(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!sex ||
		!nickname.trim() ||
		!arrivedAt ||
		(!age || age == null) ||
		!breedId
		) return;
		setError("");
		try {
			await createAnimal({
				sex,
				nickname: nickname.trim(),
				arrived_at: arrivedAt,
				age: age,
				breed_id: breedId,
				parent: parent?.trim() || undefined
			});
			setSex(null);
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
		setEditParent(item.parent ?? null);
	}

	function cancelEdit() {
		setEditingInventoryNumber(null);
		setEditSex(null);
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
				sex: editSex,
				nickname: editNickname.trim(),
				arrived_at: editArrivedAt,
				age: editAge,
				breed_id: editBreedId,
				parent: editParent?.trim() || undefined
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

	const columns: Column<Animal>[] = [
		{ id: 'inventory_number', header: 'Инвентарный номер', cell: (item) => item.inventory_number },
		{
			id: 'sex',
			header: 'Пол',
			cell: (item, { isEditing }) =>
				isEditing ? (
					<select
						value={editSex ?? ""}
						onChange={(e) => setEditSex(e.target.value as Sex)}
						className={inputClass}
						required
					>
						<option value="" disabled>Выберите пол</option>
						{sexOptions.map((option) => (
							<option key={option.value} value={option.value}>{option.label}</option>
						))}
					</select>
				) : (
					sexLabels[item.sex]
				),
		},
		{
			id: 'nickname',
			header: 'Кличка',
			cell: (item, { isEditing }) =>
				isEditing ? (
					<input
						value={editNickname}
						onChange={(e) => setEditNickname(e.target.value)}
						className={inputClass}
					/>
				) : (
					item.nickname
				),
		},
		{
			id: 'arrived_at',
			header: 'Дата прибытия',
			cell: (item, { isEditing }) =>
				isEditing ? (
					<input
						type="date"
						value={editArrivedAt}
						onChange={(e) => setEditArrivedAt(e.target.value)}
						className={inputClass}
					/>
				) : (
					item.arrived_at
				),
		},
		{
			id: 'age',
			header: 'Возраст',
			cell: (item, { isEditing }) =>
				isEditing ? (
					<input
						value={editAge ?? ""}
						onChange={(e) => setEditAge(Number(e.target.value))}
						className={inputClass}
					/>
				) : (
					item.age
				),
		},
		{
			id: 'breed_id',
			header: 'Порода',
			cell: (item, { isEditing }) =>
				isEditing ? (
					<select
						value={editBreedId ?? ""}
						onChange={(e) => setEditBreedId(Number(e.target.value))}
						className={inputClass}
						required
					>
						<option value="" disabled>Выберите породу</option>
						{breeds.map((t) => (
							<option key={t.id} value={t.id}>{t.name}</option>
						))}
					</select>
				) : (
					item.breed_id
				),
		},
		{
			id: 'parent',
			header: 'Информация о родителе',
			cell: (item, { isEditing }) =>
				isEditing ? (
					<input
						value={editParent ?? ""}
						onChange={(e) => setEditParent(e.target.value)}
						className={inputClass}
					/>
				) : (
					item.parent
				),
		},
	];

	return (
		<CrudPageLayout
			title="Животные"
			error={error}
			form={
				<form onSubmit={handleCreate}>
					<select
						value={sex ?? ""}
						onChange={(e) => setSex(e.target.value as Sex)}
						className={inputClass}
						required
					>
						<option value="" disabled>Выберите пол</option>
						{sexOptions.map((option) => (
							<option key={option.value} value={option.value}>{option.label}</option>
						))}
					</select>
					<input
						value={nickname}
						onChange={(e) => setNickname(e.target.value)}
						className={inputClass}
						placeholder="Кличка"
					/>
					<input
						type="date"
						value={arrivedAt}
						onChange={(e) => setArrivedAt(e.target.value)}
						className={inputClass}
						placeholder="Дата прибытия"
					/>
					<input
						value={age ?? ""}
						onChange={(e) => setAge(Number(e.target.value))}
						className={inputClass}
						placeholder="Возраст"
					/>
					<select
						value={breedId ?? ""}
						onChange={(e) => setBreedId(Number(e.target.value))}
						className={inputClass}
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
						className={inputClass}
						placeholder="Информация о родителе"
					/>
					<button type="submit" className={btnPrimary}>Создать</button>
				</form>
			}
		>
			<DataTable
				loading={loading}
				data={items}
				columns={columns}
				getRowKey={(item) => item.inventory_number}
				isEditing={(item) => editingInventoryNumber === item.inventory_number}
				actions={(item, { isEditing }) => (
					<RowActions
						isEditing={isEditing}
						onEdit={() => startEdit(item)}
						onDelete={() => handleDelete(item.inventory_number)}
						onSave={() => saveEdit(item.inventory_number)}
						onCancel={cancelEdit}
					/>
				)}
			/>
		</CrudPageLayout>
	)
}
