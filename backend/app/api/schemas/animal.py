from datetime import date
from pydantic import BaseModel


class AnimalCreate(BaseModel):
	sex: str
	nickname: str
	arrived_at: date
	age: int
	breed_id: int
	parent: str

class AnimalRead(BaseModel):
	inventory_number: int
	sex: str
	nickname: str
	arrived_at: date
	age: int
	breed_id: int
	parent: int

	model_config = {"from_attributes": True}