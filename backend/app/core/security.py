import bcrypt
from jose import jwt

SECRET_KEY = "7f739a139e64f66d_EXAMPLE"
ALGORITHM = "HS256"

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode(), hashed.encode())
def create_access_token(subject: str) -> str:
    return jwt.encode({"sub": subject}, SECRET_KEY, algorithm=ALGORITHM)