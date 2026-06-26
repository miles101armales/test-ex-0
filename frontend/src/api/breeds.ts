import { api } from "./client";

export type Breed = { id: number; name: string; animaltype_id: number };
export type BreedUpdate = {
  name?: string;
  animaltype_id?: number;
};

export function listBreeds() {
  return api<Breed[]>("/breeds/");
}

export function createBreed(data: { name: string; animaltype_id: number }) {
  return api<Breed>("/breeds/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateBreed(id: number, data: BreedUpdate) {
  return api<Breed>(`/breeds/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function deleteBreed(id: number) {
  return api<void>(`/breeds/${id}`, { method: "DELETE" });
}