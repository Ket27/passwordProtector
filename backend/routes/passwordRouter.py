from fastapi import APIRouter, Path, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from config.connect import get_db
from structures.schemas import PasswordRequest, DeleteRequest
from config.security import verify_jwt
from structures.models import PasswordModel
from sqlalchemy.dialects.postgresql import UUID 
from uuid import UUID

router = APIRouter()

@router.post("/password/{user_id}")
async def postAccountPassword(
    user_id: UUID = Path(..., description="User ID for chat history"),
    request: PasswordRequest = None,
    db: Session = Depends(get_db),
    current_user_id : UUID = Depends(verify_jwt)
):
    if current_user_id != user_id:
        raise HTTPException(status_code=400, detail="Unauthorised")

    try:
        if not request.accountname:
            raise HTTPException(status_code=400, detail="All fields are required")
        
        password = PasswordModel(account_name=request.accountname, iv=request.iv, ciphertext=request.ciphertext, user_id=user_id)

        db.add(password)
        db.commit()
        db.refresh(password)

        return {"message":"Password encrypted successfully", "id":password.id, "account_name": password.account_name,
                    "ciphertext": password.ciphertext,
                    "iv": password.iv}
    
    except Exception as e:
        print(f"Error fetching passwords: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch passwords")

@router.get("/password/{user_id}")
async def getAccountPassword(
    user_id: UUID = Path(..., description="User ID for chat history"),
    db: Session = Depends(get_db),
    current_user_id : UUID = Depends(verify_jwt)
):
    if current_user_id != user_id:
        raise HTTPException(status_code=400, detail="Unauthorised")
    
    try:    
        passwords = db.query(PasswordModel).filter(PasswordModel.user_id == current_user_id).all()

        password_list = [
                {
                    "id": password.id,
                    "account_name": password.account_name,
                    "ciphertext": password.ciphertext,
                    "iv": password.iv
                }
                for password in passwords
            ]

        return {"passwords": password_list}
    
    except Exception as e:
        print(f"Error fetching passwords: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch passwords")
    
@router.delete("/password/{user_id}")
async def deletePassword(
    user_id : UUID= Path(..., description="User ID for chat history"), 
    pwd_id : int = Query(..., alias="passwordId", description="User ID of the account owner"),
    db : Session = Depends(get_db), 
    current_user_id :UUID = Depends(verify_jwt)
):
    if(current_user_id != user_id) :
        raise HTTPException(status_code=400, detail="Unauthorised")
    
    try :
        password = db.query(PasswordModel).filter(PasswordModel.id==pwd_id).first()

        db.delete(password)
        db.commit()

        return {
            "message" : "password deleted"
        }

    except Exception as e:
        print(f"Error fetching passwords: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch passwords")
