import { useEffect, useState } from "react";
import { createWeighting } from "../api/weightings";
import { listAnimals, type Animal } from "../api/animals";
import { Link } from 'react-router-dom';
import { btnPrimary, formClass, inputClass } from '../App';

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

  	async function handleSubmit(e: React.SubmitEvent) {
    	e.preventDefault();
    	if (!animalInventoryNumber || !weightedAt || !weight) return;
    	setError("");
    	setSuccess("");
    	try {
      		await createWeighting({
				animal_inventory_number: animalInventoryNumber,
				weighted_at: weightedAt,
				weight: weight,
			});
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
			{error && <p className="mb-4 text-sm text-red-600">{error}</p>}
			{success && <p className="mb-4 text-sm text-green-600">{success}</p>}
			<form onSubmit={handleSubmit} className={formClass}>
				<select
					value={animalInventoryNumber ?? ""}
					onChange={(e) => setAnimalInventoryNumber(Number(e.target.value))}
					className={inputClass}
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
					className={inputClass}
					placeholder="Дата взвешивания"
				/>
				<input
					type="number"
					value={weight ?? ""}
					onChange={(e) => setWeight(Number(e.target.value))}
					className={inputClass}
					placeholder="Вес, кг"
				/>
				<button type="submit" className={btnPrimary}>Создать</button>
			</form>
			<p>
				<Link to="/weightings" className="text-sm font-medium text-gray-700 hover:text-accent">Все взвешивания →</Link>
			</p>
		</div>
  	);
}