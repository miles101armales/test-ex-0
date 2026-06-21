from datetime import date
from pydantic import BaseModel, Field


class WeightingCreate(BaseModel):
	animal_inventory_number: int
	weighted_at: date
	weight: int = Field(gt=0)

class WeightingRead(BaseModel):
	id: int
	animal_inventory_number: int
	weighted_at: date
	weight: int
	user_id: int

	model_config = {"from_attributes": True}