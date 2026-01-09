from pinecone import Pinecone
from langchain_pinecone import PineconeVectorStore
from langchain_openai import OpenAIEmbeddings
from dotenv import load_dotenv
import os

load_dotenv()

INDEX_NAME = "ai-career-agent"

# Pinecone client
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))

# Embedding model
embeddings = OpenAIEmbeddings(
    model="text-embedding-3-small"
)

# Vector store (runtime usage)
vectorstore = PineconeVectorStore(
    index_name=INDEX_NAME,
    embedding=embeddings
)
