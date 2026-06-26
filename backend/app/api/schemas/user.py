from pydantic import BaseModel

from app.database.models import UserRoles


class UserRead(BaseModel):
	id: int
	login: str
	email: str
	role: UserRoles
	is_active: bool
	is_enabled: bool

	model_config = {"from_attributes": True}

class UserUpdate(BaseModel):
	login: str | None = None
	email: str | None = None
	hash_password: str | None = None
	role: UserRoles | None = None

class UserEnabledUpdate(BaseModel):
	is_enabled: bool