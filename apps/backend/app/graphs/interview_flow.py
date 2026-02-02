from typing import TypedDict, List
from langgraph.graph import StateGraph, END
from langchain_openai import ChatOpenAI
from app.prompts.interview_prompt import INTERVIEW_PROMPT

class InterviewState(TypedDict):
    messages: List[dict]
    resume_text: str
    job_description: str

llm = ChatOpenAI(model="gpt-4o-mini")

async def agent(state: InterviewState):
    chain = INTERVIEW_PROMPT | llm

    response = await chain.ainvoke({
        "resume_text": state["resume_text"],
        "job_description": state["job_description"],
        "history": state["messages"][:-1],
        "user_input": state["messages"][-1]["content"]
    })

    return {
        "messages": state["messages"] + [{
            "role": "assistant",
            "content": response.content
        }]
    }

workflow = StateGraph(InterviewState)
workflow.add_node("agent", agent)
workflow.set_entry_point("agent")
workflow.add_edge("agent", END)

interview_graph = workflow.compile()
