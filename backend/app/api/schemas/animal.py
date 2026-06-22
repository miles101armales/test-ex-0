from datetime import date
from pydantic import BaseModel


class AnimalCreate(BaseModel):
	inventory_number: int
	sex: str
	nickname: str
	arrived_at: date
	age: int
	breed_id: int
	parent: str | None

class AnimalRead(BaseModel):
	inventory_number: int
	sex: str
	nickname: str
	arrived_at: date
	age: int
	breed_id: int
	parent: str | None

	model_config = {"from_attributes": True}