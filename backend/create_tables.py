from .database import Base, engine
from . import models
 # make sure your models.py defines User, Evaluation, etc.

# Create all tables in the database
Base.metadata.create_all(bind=engine)
print("Tables created successfully!")
