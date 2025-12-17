from config.settings import settings
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from typing import Generator

engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True, pool_recycle=300, echo = True)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db() -> Generator:
    """
    Database session dependency for FastAPI.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()