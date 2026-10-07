const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// 1. First create a chat session
export const createChatSession = async (title: string, documentId: string | null, token: string) => {
  const response = await fetch(`${API_URL}/api/v1/chat/session`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ title, document_id: documentId })
  });
  if (!response.ok) throw new Error('Failed to create session');
  return response.json(); // Returns { id: "session-uuid", ... }
};

// 2. Stream the chat messages
export const streamChatMessage = async (
  sessionId: string, 
  message: string, 
  token: string, 
  onChunk: (text: string) => void
) => {
  const response = await fetch(`${API_URL}/api/v1/chat/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      session_id: sessionId,
      message: message,
      document_id: null // optional filter
    })
  });

  if (!response.ok) throw new Error('Failed to send message');
  if (!response.body) throw new Error("ReadableStream not supported");

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunkStr = decoder.decode(value, { stream: true });
    // SSE sends data in the format: data: Hello world\n\n
    const lines = chunkStr.split('\n');
    
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.replace('data: ', '');
        if (data.trim() === '[DONE]') return;
        
        // Re-add safe newlines
        const textToAppend = data.replace(/\\n/g, '\n');
        onChunk(textToAppend); // Append this string to your UI state
      }
    }
  }
};
