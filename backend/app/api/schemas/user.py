from pydantic import BaseModel


class UserRead(BaseModel):
	id: int
	login: str
	email: str
	role: str
	is_active: bool
	is_enabled: bool

	model_config = {"from_attributes": True}

class UserUpdate(BaseModel):
	login: str | None = None
	email: str | None = None
	hash_password: str | None = None
	role: str | None = None

class UserEnabledUpdate(BaseModel):
	is_enabled: bool