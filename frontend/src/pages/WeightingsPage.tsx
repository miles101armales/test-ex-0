import { type FormEvent, useEffect, useState } from 'react';
import {
	createWeighting,
	deleteWeighting,
	listWeightings,
	updateWeighting,
	type Weighting,
} from '../api/weightings';
import { listAnimals, type Animal } from '../api/animals';
import { CrudPageLayout, DataTable, RowActions, type Column } from '../components/table';

export function WeightingsPage() {
	const [items, setItems] = useState<Weighting[]>([]);
	const [animals, setAnimals] = useState<Animal[]>([]);
	const [animalInventoryNumber, setAnimalInventoryNumber] = useState<number | null>(null);
	const [weightedAt, setWeightedAt] = useState("");
	const [weight, setWeight] = useState<number | null>(null);
	const [editingId, setEditingId] = useState<number | null>(null);
	const [editAnimalInventoryNumber, setEditAnimalInventoryNumber] = useState<number | null>(null);
	const [editWeightedAt, setEditWeightedAt] = useState("");
	const [editWeight, setEditWeight] = useState<number | null>(null);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(true);

	async function load() {
		setError("");
		setLoading(true);
		try {
			setItems(await listWeightings());
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
		listAnimals().then(setAnimals);
	}, []);

	async function handleCreate(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!animalInventoryNumber ||
			!weightedAt ||
			(!weight || weight == null)
		) return;
		setError("");
		try {
			await createWeighting({
				animal_inventory_number: animalInventoryNumber,
				weighted_at: weightedAt,
				weight: weight,
			});
			setAnimalInventoryNumber(null);
			setWeightedAt("");
			setWeight(null);
			await load();
		} catch (error) {
			setError(error instanceof Error ? error.message : "Ошибка создания");
		}
	}

	function startEdit(item: Weighting) {
		setEditingId(item.id);
		setEditAnimalInventoryNumber(item.animal_inventory_number);
		setEditWeightedAt(String(item.weighted_at).slice(0, 10));
		setEditWeight(item.weight);
	}

	function cancelEdit() {
		setEditingId(null);
		setEditAnimalInventoryNumber(null);
		setEditWeightedAt("");
		setEditWeight(null);
	}

	async function saveEdit(id: number) {
		if (!editAnimalInventoryNumber ||
			!editWeightedAt ||
			(!editWeight || editWeight == null)
		) return;
		setError("");
		try {
			await updateWeighting(id, {
				animal_inventory_number: editAnimalInventoryNumber,
				weighted_at: editWeightedAt,
				weight: editWeight,
			});
			cancelEdit();
			await load();
		} catch (error) {
			setError(error instanceof Error ? error.message : "Ошибка сохранения")
		}
	}

	async function handleDelete(id: number) {
		if (!confirm("Удалить взвешивание?")) return;
		setError("");
		try {
			await deleteWeighting(id);
			await load();
		} catch (error) {
			setError(error instanceof Error ? error.message : "Ошибка удаления");
		}
	}

	const columns: Column<Weighting>[] = [
		{ id: 'id', header: 'ID', cell: (item) => item.id },
		{
			id: 'animal',
			header: 'Животное',
			cell: (item, { isEditing }) =>
				isEditing ? (
					<select
						value={editAnimalInventoryNumber ?? ""}
						onChange={(e) => setEditAnimalInventoryNumber(Number(e.target.value))}
						required
					>
						<option value="" disabled>Выберите животное</option>
						{animals.map((a) => (
							<option key={a.inventory_number} value={a.inventory_number}>
								{a.inventory_number} — {a.nickname}
							</option>
						))}
					</select>
				) : (
					item.animal_inventory_number
				),
		},
		{
			id: 'weighted_at',
			header: 'Дата',
			cell: (item, { isEditing }) =>
				isEditing ? (
					<input
						type="date"
						value={editWeightedAt}
						onChange={(e) => setEditWeightedAt(e.target.value)}
					/>
				) : (
					String(item.weighted_at).slice(0, 10)
				),
		},
		{
			id: 'weight',
			header: 'Вес, кг',
			cell: (item, { isEditing }) =>
				isEditing ? (
					<input
						type="number"
						value={editWeight ?? ""}
						onChange={(e) => setEditWeight(Number(e.target.value))}
					/>
				) : (
					item.weight
				),
		},
		{ id: 'user_id', header: 'Пользователь', cell: (item) => item.user_id },
	];

	return (
		<CrudPageLayout
			title="Взвешивания"
			error={error}
			form={
				<form onSubmit={handleCreate}>
					<select
						value={animalInventoryNumber ?? ""}
						onChange={(e) => setAnimalInventoryNumber(Number(e.target.value))}
						required
					>
						<option value="" disabled>Выберите животное</option>
						{animals.map((a) => (
							<option key={a.inventory_number} value={a.inventory_number}>
								{a.inventory_number} — {a.nickname}
							</option>
						))}
					</select>
					<input
						type="date"
						value={weightedAt}
						onChange={(e) => setWeightedAt(e.target.value)}
						placeholder="Дата взвешивания"
					/>
					<input
						type="number"
						value={weight ?? ""}
						onChange={(e) => setWeight(Number(e.target.value))}
						placeholder="Вес, кг"
					/>
					<button type="submit">Создать</button>
				</form>
			}
		>
			<DataTable
				loading={loading}
				data={items}
				columns={columns}
				getRowKey={(item) => item.id}
				isEditing={(item) => editingId === item.id}
				actions={(item, { isEditing }) => (
					<RowActions
						isEditing={isEditing}
						onEdit={() => startEdit(item)}
						onDelete={() => handleDelete(item.id)}
						onSave={() => saveEdit(item.id)}
						onCancel={cancelEdit}
					/>
				)}
			/>
		</CrudPageLayout>
	)
}
