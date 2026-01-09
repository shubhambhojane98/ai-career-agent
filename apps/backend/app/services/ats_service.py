from langchain_openai import ChatOpenAI
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.output_parsers import JsonOutputParser
from app.prompts.ats_prompt import ATS_PROMPT
from app.services.parser_service import load_pdf
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


async def run_ats_pipeline(resume_file, jd_text: str):
    #  Load resume PDF (must return List[Document])
    docs = load_pdf(resume_file)

    #  Chunk resume
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=800,
        chunk_overlap=150
    )
    resume_chunks = splitter.split_documents(docs)

    # Store embeddings
    vectorstore.add_documents(
        documents=resume_chunks,
        namespace="resumes"
    )

    # Semantic similarity (JD → resume)
    results = vectorstore.similarity_search_with_score(
        jd_text,
        k=5,
        namespace="resumes"
    )

    if not results:
        similarity = 0.0
    else:
        scores = [score for _, score in results]
        similarity = round(sum(scores) / len(scores), 2)

    #  LLM analysis
    resume_text = "\n".join(doc.page_content for doc in docs)

    analysis = chain.invoke({
        "resume": resume_text,
        "jd": jd_text,
        "similarity": similarity
    })

    return {
        "ats_score": similarity,
        "analysis": analysis
    }
