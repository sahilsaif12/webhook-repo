from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

client = MongoClient(os.getenv("MONGO_URI"))
db = client["webhook_db"]
events_collection = db["github_events"]


if __name__ == "__main__":
    print(os.getenv("MONGO_URI"))