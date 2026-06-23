from pydantic import BaseModel


class AnimalTypeCreate(BaseModel):
	name: str

class AnimalTypeUpdate(BaseModel):
	name: str

class AnimalTypeRead(BaseModel):
	id: int
	name: str

	model_config = {"from_attributes": True}