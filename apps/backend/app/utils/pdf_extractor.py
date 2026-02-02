from pypdf import PdfReader
from io import BytesIO

def extract_pdf_text(pdf_bytes: bytes) -> str:
    reader = PdfReader(BytesIO(pdf_bytes))
    text = ""

    for page in reader.pages:
        text += page.extract_text() or ""

    return text.strip()
