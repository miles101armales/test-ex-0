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

class AnimalUpdate(BaseModel):
	sex: str | None = None
	nickname: str | None = None
	arrived_at: date | None = None
	age: int | None = None
	breed_id: int | None = None
	parent: str | None = None

class AnimalRead(BaseModel):
	inventory_number: int
	sex: str
	nickname: str
	arrived_at: date
	age: int
	breed_id: int
	parent: str | None

	model_config = {"from_attributes": True}