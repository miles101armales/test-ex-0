from pydantic import BaseModel


class BreedCreate(BaseModel):
	name: str
	animaltype_id: int

class BreedRead(BaseModel):
	id: int
	name: str
	animaltype_id: int

	model_config = {"from_attributes": True}