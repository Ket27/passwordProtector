import os
import base64
from fastapi import APIRouter, Depends, HTTPException, status
from structures.schemas import LoginRequest, SignupRequest
from config.connect import get_db
from sqlalchemy.orm import Session
from config.security import hashPassword, verifyPassword
from structures.models import UserModel
from config.security import create_access_token

router = APIRouter()

@router.post("/register")
async def signup_user(request: SignupRequest, db:Session= Depends(get_db)):
    try:
        if not request.username.strip() or not request.password or not request.confirm_password:
            raise HTTPException(status_code=400, detail="All fields are required")
        
        if request.password != request.confirm_password:
            raise HTTPException(status_code=400, detail="Passwords do not match")

        user = db.query(UserModel).filter(request.username.strip() == UserModel.username).first()

        if user:
            raise HTTPException(status_code=400, detail="Username already taken")
        
        hash_pw = hashPassword(request.password)
        
        salt = os.urandom(16)
        kdf_salt = base64.b64encode(salt).decode("utf-8")
        newUser = UserModel(username=request.username.strip(), password=hash_pw, Kdf_salt=kdf_salt)
        db.add(newUser)
        db.commit()
        db.refresh(newUser)

        access_token = create_access_token(
            data = {"sub": str(user.id)}
        )

        return {"message": "User created successfully", "access_token": access_token, "user_id":newUser.id, "password": newUser.password, "salt": newUser.Kdf_salt}

    except Exception as e:
        db.rollback()
        print(f"Error during user registration: {str(e)}")
        raise HTTPException(status_code=500, detail="An error occurred during registration")

@router.post("/login")
async def login_user(request: LoginRequest, db:Session = Depends(get_db)):
    print(request.username, request.password)
    if not request.username.strip() or not request.password:
        raise HTTPException(status_code=400, detail="All fields are required")
    
    user = db.query(UserModel).filter(request.username.strip() == UserModel.username).first()

    if not user or not verifyPassword(request.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(
        data = {"sub": str(user.id)}
    )

    return {"message": "User loggedin successfully", "access_token": access_token, "user_id": user.id, "password": user.password, "salt": user.Kdf_salt}