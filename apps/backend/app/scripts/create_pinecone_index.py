from dotenv import load_dotenv
from pinecone import Pinecone
import os

load_dotenv()



pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))

index_name = "ai-career-agent"

if index_name not in pc.list_indexes().names():
    pc.create_index(
        name=index_name,
        dimension=1536,  # OpenAI embedding size
        metric="cosine"
    )
    print("✅ Pinecone index created")
else:
    print("ℹ️ Index already exists")
