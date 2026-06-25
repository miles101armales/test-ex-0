import { useEffect, useState } from "react";
import { createWeighting, type Weighting } from "../api/weightings";
import { listAnimals, type Animal } from "../api/animals";
import { Link } from 'react-router-dom';

export function HomePage() {
  	const [animals, setAnimals] = useState<Animal[]>([]);
  	const [animalInventoryNumber, setAnimalInventoryNumber] = useState<number | null>(null);
  	const [weightedAt, setWeightedAt] = useState("");
  	const [weight, setWeight] = useState<number | null>(null);
  	const [error, setError] = useState("");
  	const [success, setSuccess] = useState("");

  	useEffect(() => {
    	listAnimals().then(setAnimals);
  	}, []);

  	async function handleSubmit(e: React.FormEvent) {
    	e.preventDefault();
    	if (!animalInventoryNumber || !weightedAt || !weight) return;
    	setError("");
    	setSuccess("");
    	try {
      		await createWeighting({
        	animal_inventory_number: animalInventoryNumber,
        	weighted_at: weightedAt as unknown as Date,
        	weight: weight,
      	} as Weighting);
      	setSuccess("Взвешивание сохранено");
      	setAnimalInventoryNumber(null);
      	setWeightedAt("");
      	setWeight(null);
    	} catch (e) {
      		setError(e instanceof Error ? e.message : "Ошибка");
    	}
  	}

  	return (
		<div>
			<h1>Новое взвешивание</h1>
			{error && <p style={{ color: "red" }}>{error}</p>}
			{success && <p style={{ color: "green" }}>{success}</p>}
			<form onSubmit={handleSubmit}>
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
			<p>
				<Link to="/weightings">Все взвешивания →</Link>
			</p>
		</div>
  	);
}