import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# Use your existing Render PostgreSQL database
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres_xmeu_user:8Q65JnFx8Q5x5sbClSNUxGL1GukboD9V@dpg-d0qdcq6mcj7s73dune8g-a.oregon-postgres.render.com/postgres_xmeu")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
