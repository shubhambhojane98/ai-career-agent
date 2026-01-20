import uuid

from langchain_openai import ChatOpenAI
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.output_parsers import JsonOutputParser
from app.prompts.ats_prompt import ATS_PROMPT
from app.services.parser_service import load_pdf_docs
from app.services.pinecone_service import vectorstore


# LLM setup
llm = ChatOpenAI(
    model="gpt-4o-mini",
    temperature=0
)

# Enforce JSON output
parser = JsonOutputParser(
    pydantic_object=None  # Optional now, add schema later
)

# Runnable chain
chain = ATS_PROMPT | llm | parser

def generate_guest_namespace() -> str:
    return f"ats_guest_{uuid.uuid4().hex}"


async def run_ats_pipeline(
    resume_file,
    jd_text: str,
    *,
    user_id: str | None = None
):

    if user_id:
        namespace = f"user_{user_id}"
        is_guest = False

        # Ensure only ONE resume per user
        vectorstore._index.delete(
            delete_all=True,
            namespace=namespace
        )
    else:
        namespace = generate_guest_namespace()
        is_guest = True

    try:
        
        #  Load resume PDF (must return List[Document])
        docs = load_pdf_docs(resume_file)

        print("PAGES:", len(docs))
        print("SAMPLE TEXT:", docs[0].page_content[:300]) 

        #  Chunk resume
        splitter = RecursiveCharacterTextSplitter(
            chunk_size=800,
            chunk_overlap=150
        )
        resume_chunks = splitter.split_documents(docs)

        print("CHUNKS:", len(resume_chunks))


        # Store embeddings
        vectorstore.add_documents(
            documents=resume_chunks,
            namespace= namespace
        )

        print("STORING CHUNKS IN PINECONE")


        # Semantic similarity (JD → resume)
        results = vectorstore.similarity_search_with_score(
            jd_text,
            k=5,
            namespace=namespace
        )

        print("SIMILARITY RESULTS:", results)

        if not results:
            similarity = 0.0
        else:
            scores = [score for _, score in results]
            similarity = round(sum(scores) / len(scores), 2)

        print("SIMILARITY SCORE:", similarity)
        
        #  LLM analysis
        resume_text = "\n".join(doc.page_content for doc in docs)

        print("RESUME LENGTH:", len(resume_text))

        analysis = chain.invoke({
            "resume": resume_text,
            "jd": jd_text,
            "similarity": similarity
        })
        print("LLM OUTPUT:", analysis)

        return analysis
    
    finally:
        if is_guest:
            vectorstore._index.delete(
                delete_all=True,
                namespace=namespace
            )
