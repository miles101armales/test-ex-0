import { api } from "./client";

export type Animal = { 
	inventory_number: number;
  	sex: string;
  	nickname: string,
  	arrived_at: string,
	age: number,
	breed_id: number,
	parent?: string
};

export type AnimalUpdate = {
	sex?: string;
	nickname?: string,
	arrived_at?: string,
	age?: number,
	breed_id?: number,
	parent?: string
};

export function listAnimals() {
	return api<Animal[]>("/animals/");
}

export function createAnimal(data: {
	sex: string;
  	nickname: string,
  	arrived_at: string,
	age: number,
	breed_id: number,
	parent?: string
}) {
	return api<Animal>("/animals/", {
		method: "POST",
		body: JSON.stringify(data),
	});
}

export function updateAnimal(inventoryNumber: number, data: AnimalUpdate) {
	return api<Animal>(`/animals/${inventoryNumber}`, {
    	method: "PATCH",
    	body: JSON.stringify(data),
  	});
}

export function deleteAnimal(inventoryNumber: number) {
  	return api<void>(`/animals/${inventoryNumber}`, { method: "DELETE" });
}