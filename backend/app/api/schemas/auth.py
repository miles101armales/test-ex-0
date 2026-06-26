from pydantic import BaseModel

from app.database.models import UserRoles


class RegisterRequest(BaseModel):
	login: str
	email: str
	password: str

class RegisterResponse(BaseModel):
	message: str

class LoginRequest(BaseModel):
	login: str
	password: str

class LoginResponse(BaseModel):
	access_token: str
	token_type: str = "bearer"

class MeResponse(BaseModel):
    login: str
    role: UserRoles