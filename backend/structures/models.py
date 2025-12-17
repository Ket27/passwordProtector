from sqlalchemy import Column, Integer, String, TIMESTAMP, text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID 
from sqlalchemy.orm import relationship
import uuid
from config.connect import Base

class UserModel(Base):
    __tablename__ = "userTable"

    id = Column(UUID(as_uuid=True), primary_key=True, unique=True, index=True,default=uuid.uuid4)
    username = Column(String, nullable=False)
    password = Column(String, nullable=False)
    Kdf_salt = Column(String, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))

    messages = relationship("PasswordModel", back_populates="user", cascade="all, delete-orphan")


class PasswordModel(Base):
    __tablename__ = "passwordTable"

    id = Column(Integer, unique=True, nullable=False, primary_key=True, index=True, autoincrement=True)
    account_name = Column(String, nullable=False)
    iv = Column(String, nullable=False)
    ciphertext = Column(String,nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("userTable.id", ondelete="CASCADE"))
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))

    user = relationship("UserModel", back_populates="messages")