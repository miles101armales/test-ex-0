import { api } from "./client";

export type Weighting = { 
	id: number;
  	animal_inventory_number: number;
  	weighted_at: Date,
  	weight: number,
	user_id: number
 };

export type WeightingUpdate = {
  	animal_inventory_number?: number;
  	weighted_at?: Date,
  	weight?: number,
	user_id?: number
};

export function listWeightings() {
	return api<Weighting[]>("/weightings/");
}

export function createWeighting(data: Weighting) {
	return api<Weighting>("/weightings/", {
		method: "POST",
		body: JSON.stringify(data),
	});
}

export function updateWeighting(id: number, data: WeightingUpdate) {
	return api<Weighting>(`/weightings/${id}`, {
    	method: "PATCH",
    	body: JSON.stringify(data),
  	});
}

export function deleteAnimal(id: number) {
  	return api<void>(`/weightings/${id}`, { method: "DELETE" });
}