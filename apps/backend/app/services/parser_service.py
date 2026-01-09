from langchain_community.document_loaders import PyPDFLoader
from tempfile import NamedTemporaryFile
import os


def load_pdf_docs(file):
    """
    Load PDF and return LangChain Documents
    """
    with NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        tmp.write(file.file.read())
        tmp_path = tmp.name

    loader = PyPDFLoader(file_path=tmp_path)
    docs = loader.load()

    os.remove(tmp_path)
    return docs
