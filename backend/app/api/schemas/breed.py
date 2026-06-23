from pydantic import BaseModel


class BreedCreate(BaseModel):
	name: str
	animaltype_id: int

class BreedUpdate(BaseModel):
	name: str | None = None
	animaltype_id: int | None = None

class BreedRead(BaseModel):
	id: int
	name: str
	animaltype_id: int

	model_config = {"from_attributes": True}