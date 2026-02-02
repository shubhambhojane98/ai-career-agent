import os
from openai import AsyncOpenAI

class AudioService:
    def __init__(self):
        self.client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    async def synthesize(self, text: str) -> bytes:
        """
        Generate TTS audio from text using async OpenAI client.
        Returns raw audio bytes (mp3).
        """
        response = await self.client.audio.speech.create(
            model="gpt-4o-mini-tts",
            voice="coral",
            instructions="Speak clearly and naturally",
            input=text,
            response_format="mp3"
        )

        # response is HttpxBinaryResponseContent — convert to bytes
        audio_bytes = response.read()  # .read() is synchronous
        return audio_bytes
