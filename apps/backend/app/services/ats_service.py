import uuid

from fastapi import UploadFile
from io import BytesIO
from langchain_openai import ChatOpenAI
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.output_parsers import JsonOutputParser
from app.prompts.ats_prompt import ATS_PROMPT
from app.services.parser_service import load_pdf_docs
from app.services.pinecone_service import vectorstore
from app.services.analysis_service import save_ats_analysis , delete_existing_resume_and_analysis
from app.services.storage_service import upload_resume_to_supabase


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
    job_description: str,
    *,
    user_id: str | None = None
):
    print("USER ID", user_id)
    namespace_created = False
        # 🔥 READ FILE ONCE
    pdf_bytes = await resume_file.read()

        # 🔥 Reset file pointer for PDF parsing
    resume_file.file = BytesIO(pdf_bytes)

    if user_id:
        namespace = f"user_{user_id}"
        is_guest = False

        # ✅ DELETE OLD DATA (NEW)
        delete_existing_resume_and_analysis(user_id)

        try:
            # Ensure only ONE resume per user
            vectorstore._index.delete(
                delete_all=True,
                namespace=namespace
            )
        except Exception:
            pass

                # ✅ Upload resume
        resume_path = await upload_resume_to_supabase(
                file_bytes=pdf_bytes,
                filename=resume_file.filename,
                user_id=user_id  
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
         
        namespace_created = True

        print("STORING CHUNKS IN PINECONE")


        # Semantic similarity (JD → resume)
        results = vectorstore.similarity_search_with_score(
            job_description,
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
            "jd": job_description,
            "similarity": similarity
        })
        print("LLM OUTPUT:", analysis)

        if user_id:
            save_ats_analysis(
                user_id=user_id,
                similarity=similarity,
                analysis=analysis,
                resume_path=resume_path,
                job_description=job_description
            )

        return analysis
    
    finally:
        if is_guest and namespace_created:
            try:
                vectorstore._index.delete(
                    delete_all=True,
                    namespace=namespace
                )
            except Exception:
                pass
