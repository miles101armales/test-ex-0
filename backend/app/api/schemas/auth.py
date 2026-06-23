from pydantic import BaseModel


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