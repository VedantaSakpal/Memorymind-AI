import os
import google.generativeai as genai
from backend.config.settings import settings
from typing import List, Dict, AsyncGenerator

if hasattr(settings, "GEMINI_API_KEY") and settings.GEMINI_API_KEY:
    genai.configure(api_key=settings.GEMINI_API_KEY)

async def stream_rag_answer(
    query: str,
    context_chunks: List[Dict],
    chat_history: List[Dict] = None
) -> AsyncGenerator[str, None]:
    
    context_text = "\n\n".join([f"Source ID: {c['id']}\n{c['content']}" for c in context_chunks])
    
    from loguru import logger
    logger.info(f"[CHAT] RAG context length: {len(context_text)} characters")
    logger.info(f"[CHAT] Sending context to LLM")
    
    system_prompt = f"""You are MemoryMind AI, a document learning assistant.

Answer the user's question using the provided document context.

If the answer is present in the context, answer accurately.

If the answer cannot be found in the provided context, clearly say that the uploaded documents do not contain enough information.

Do not invent facts.

DOCUMENT CONTEXT:
{context_text}
"""
    
    try:
        model = genai.GenerativeModel(
            model_name='gemini-1.5-flash-latest',
            system_instruction=system_prompt
        )
        
        history = []
        if chat_history:
            for msg in chat_history:
                role = 'model' if msg['role'] == 'assistant' else 'user'
                history.append({'role': role, 'parts': [msg['content']]})
                
        chat = model.start_chat(history=history)
        
        # Use stream=True but since SDK isn't natively async generator we wrap it
        # Note: `send_message` returns an iterable that blockingly loads chunks, 
        # so for production a threadpool or native async client is better.
        response = chat.send_message(query, stream=True)
        
        for chunk in response:
            if chunk.text:
                yield chunk.text
                
    except Exception as e:
        yield f"Error generating response: {str(e)}"
