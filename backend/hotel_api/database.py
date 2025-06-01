# hotel_api/database.py

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base # Zmień import declarative_base
# Jeśli używasz mysqlclient:

# Jeśli używasz PyMySQL:
# SQLALCHEMY_DATABASE_URL = "mysql+pymysql://root:aleksanderthegreat@10.154.37.4:3306/hotel?charset=utf8mb4"

engine = create_engine(SQLALCHEMY_DATABASE_URL) # Bez connect_args

# # Użyj SQLite — plik lokalny o nazwie hotel.db
# SQLALCHEMY_DATABASE_URL = "sqlite:///./hotel.sqlite"

# # Dla SQLite trzeba dodać connect_args z 'check_same_thread': False
# engine = create_engine(
#     SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
# )


SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db(): # Pozostaje synchroniczne
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()