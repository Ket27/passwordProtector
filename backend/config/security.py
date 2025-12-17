from passlib.context import CryptContext
from config.settings import settings
from fastapi import HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
import bcrypt
from sqlalchemy.dialects.postgresql import UUID 
from uuid import UUID
from jose import jwt, JWTError

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

def hashPassword(password : str) -> str:
    pwd_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(pwd_bytes, salt)
    return hashed.decode('utf-8')

def verifyPassword(password:str, hashedPassword: str) -> bool:
    pwd_bytes = password.encode('utf-8')
    hashed_bytes = hashedPassword.encode('utf-8')
    return bcrypt.checkpw(pwd_bytes, hashed_bytes)

def create_access_token(data: dict) -> str:
    """Create a JWT."""
    to_encode = data.copy()
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def verify_jwt(token: str = Depends(oauth2_scheme)) -> UUID:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token payload")
        
        # Convert to int since JWT stores everything as strings
        try:
            user_id = UUID(user_id)
            return user_id
        except (ValueError, TypeError):
            raise HTTPException(status_code=401, detail="Invalid user ID format in token")
    
    except JWTError as e:
        raise HTTPException(status_code=401, detail="Invalid token")