from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Supabase connection string
DATABASE_URL = "postgresql://postgres:heartattack@db.ghmvmxjqlzwnhhmjebom.supabase.co:5432/postgres?sslmode=require"

# Create engine
engine = create_engine(DATABASE_URL, connect_args={"sslmode": "require"})
print("Connecting to:", DATABASE_URL)

# Create session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
