import { api } from './client';

export type AnimalType = { id: number, name: string };

export function listAnimalTypes() {
	return api<AnimalType[]>("/animaltypes/");
}

export function createAnimalType(name: string) {
	return api<AnimalType>("/animaltypes/", {
		method: "POST",
		body: JSON.stringify({ name }),
	});
}

export function updateAnimalType(id: number, name: string) {
	return api<AnimalType>(`/animaltypes/${id}`, {
		method: "PATCH",
		body: JSON.stringify({ name }),
	});
}

export function deleteAnimalType(id: number) {
	return api<void>(`/animaltypes/${id}`, {
		method: "DELETE"
	});
}