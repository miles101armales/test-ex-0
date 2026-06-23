from passlib.context import CryptContext
from jose import jwt

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = "7f739a139e64f66d_EXAMPLE"
ALGORITHM = "HS256"

def hash_password(password: str) -> str:
	return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
	return pwd_context.verify(plain, hashed)

def create_access_token(subject: str) -> str:
	return jwt.encode({"sub": subject}, SECRET_KEY, algorithm=ALGORITHM)