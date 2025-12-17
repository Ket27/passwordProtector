from pydantic import BaseModel
from typing import Any, Dict
from typing import Optional 

class LoginRequest(BaseModel):
    username: str
    password: str

class SignupRequest(BaseModel):
    username: str
    password: str
    confirm_password: str

class PasswordRequest(BaseModel):
    accountname: str
    iv: str
    ciphertext: str

class DeleteRequest(BaseModel):
    id : int