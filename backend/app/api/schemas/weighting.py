from datetime import date
from pydantic import BaseModel


class WeightingCreate(BaseModel):
	animal_inventory_number: int
	weighted_at: date