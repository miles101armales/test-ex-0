import { type FormEvent, useEffect, useState } from 'react';
import { createAnimalType, deleteAnimalType, listAnimalTypes, updateAnimalType, type AnimalType } from '../api/animalTypes';
import { CrudPageLayout, DataTable, RowActions, type Column } from '../components/table';

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
		 void Promise.resolve().then(load);
	}, []);

	async function handleCreate(event: FormEvent<HTMLFormElement>) {
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

	const columns: Column<AnimalType>[] = [
		{ id: 'id', header: 'ID', cell: (item) => item.id },
		{
			id: 'name',
			header: 'Название',
			cell: (item, { isEditing }) =>
				isEditing ? (
					<input
						value={editName}
						onChange={(e) => setEditName(e.target.value)}
					/>
				) : (
					item.name
				),
		},
	];

	return (
		<CrudPageLayout
			title="Типы животных"
			error={error}
			form={
				<form onSubmit={handleCreate}>
					<input
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder="Название"
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
