from passlib.context import CryptContext
from config.settings import settings
from fastapi import HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
import bcrypt
from sqlalchemy.dialects.postgresql import UUID 
from uuid import UUID
from jose import jwt, JWTError
from datetime import datetime, timedelta

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

def create_access_token(data: dict, expires_delta: timedelta = None) -> str:
    """Create a JWT."""
    to_encode = data.copy()
    if expires_delta:
        expire  = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp":expire, "type":"access"})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def create_refresh_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp":expire, "type":"refresh"})
    return jwt.encode(to_encode, settings.SECRET_KEY,algorithm=settings.ALGORITHM)

def verify_jwt(token: str = Depends(oauth2_scheme), token_type: str = "access") -> UUID:
    try:
        # print("verify_jwt called")
        # print("Token received:", token)
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id = payload.get("sub")
        # print("Decoded payload:", payload)
        # print(payload)
        # print(payload.get('type'))
        if user_id is None or payload.get("type") != token_type:
            raise HTTPException(status_code=401, detail="Invalid token payload")
        
        # Convert to int since JWT stores everything as strings
        try:
            user_id = UUID(user_id)
            return user_id
        except (ValueError, TypeError):
            raise HTTPException(status_code=401, detail="Invalid user ID format in token")
    
    except JWTError as e:
        raise HTTPException(status_code=401, detail="Invalid token")