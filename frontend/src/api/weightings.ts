import { api } from "./client";

export type Weighting = {
	id: number;
	animal_inventory_number: number;
	weighted_at: string;
	weight: number;
	user_id: number;
};
  
export type WeightingCreate = {
	animal_inventory_number: number;
	weighted_at: string;
	weight: number;
};
  
export type WeightingUpdate = {
	animal_inventory_number?: number;
	weighted_at?: string;
	weight?: number;
};

export function listWeightings() {
	return api<Weighting[]>("/weightings/");
}

export function createWeighting(data: WeightingCreate) {
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

export function deleteWeighting(id: number) {
  	return api<void>(`/weightings/${id}`, { method: "DELETE" });
}