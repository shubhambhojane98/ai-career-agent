import json
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.services.session_service import SessionService
from app.services.audio_service import AudioService
from app.services.feedback_service import FeedbackService
from app.utils.feedback_parser import parse_feedback
from app.graphs.interview_flow import interview_graph
from app.db.supabase import supabase

router = APIRouter()
session_service = SessionService()
audio_service = AudioService()
# feedback_service = FeedbackService()
feedback_service = FeedbackService(supabase_client=supabase)

MAX_QUESTIONS = 4  # number of questions per interview

@router.websocket("/session/{session_id}")
async def interview(ws: WebSocket, session_id: str, user_id: str = None):
    await ws.accept()

    context = await session_service.get_context(session_id)
    question_count = 0  # track number of questions asked

    try:
        # Add first AI question automatically
        first_question = "Hello! Let's start the interview. Can you tell me about yourself?"
        await session_service.add_message(session_id, "assistant", first_question)
        await ws.send_json({"state": "SPEAKING", "text": first_question})
        audio_bytes = await audio_service.synthesize(first_question)
        await ws.send_bytes(audio_bytes)
        await ws.send_json({"state": "LISTENING"})
        question_count += 1

        while True:
            data = await ws.receive_text()
            event = json.loads(data)

            if event["type"] == "user_answer":
                user_text = event["text"]
                await session_service.add_message(session_id, "user", user_text)

                await ws.send_json({"state": "PROCESSING"})

                messages = await session_service.get_messages(session_id)

                # Check if this is the last question
                if question_count < MAX_QUESTIONS:
                    # Generate next AI question
                    result = await interview_graph.ainvoke({
                        "messages": messages,
                        "resume_text": context["resume_text"],
                        "job_description": context["job_description"]
                    })
                    ai_text = result["messages"][-1]["content"]
                    await session_service.add_message(session_id, "assistant", ai_text)

                    # Send AI response
                    await ws.send_json({"state": "SPEAKING", "text": ai_text})
                    audio_bytes = await audio_service.synthesize(ai_text)
                    await ws.send_bytes(audio_bytes)

                    question_count += 1
                    await ws.send_json({"state": "LISTENING"})

                else:
                    # Last question answered → send final AI wrap-up
                    final_text = "Thank you for completing the interview! We appreciate your time."
                    await session_service.add_message(session_id, "assistant", final_text)
                    await ws.send_json({"state": "SPEAKING", "text": final_text})
                    audio_bytes = await audio_service.synthesize(final_text)
                    await ws.send_bytes(audio_bytes)

                    # Generate feedback
                    transcript = "\n".join(
                        f"{m['role']}: {m['content']}"
                        for m in await session_service.get_messages(session_id, limit=1000)
                    )
                    raw_feedback = await feedback_service.generate(
                        context["job_description"],
                        context["resume_text"],
                        transcript
                    )
                    feedback = parse_feedback(raw_feedback)
                    print("FEEDBACK",feedback)
                    print("USERID",user_id)

                    await feedback_service.save(
                            session_id=session_id,
                            user_id=user_id,
                            feedback=feedback
                        )

                    await ws.send_json({"state": "ENDED", "feedback": feedback})
                    break

    except WebSocketDisconnect:
        print("Interview closed")
