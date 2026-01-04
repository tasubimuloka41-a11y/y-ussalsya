// AI web agent - исправленная версия с правильным API путем

const OLLAMA_URL = 'http://127.0.0.1:11435/api/chat';
const MODEL = 'gemma3:1b';

class AIWebAgent {
  constructor() {
    this.conversationHistory = [];
    this.isRunning = false;
  }

  async askModel(prompt, imageBase64 = null) {
    const messages = [
      {
        role: 'user',
        content: prompt,
        ...(imageBase64 && { images: [imageBase64] })
      }
    ];

    try {
      const response = await fetch(OLLAMA_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: MODEL,
          messages: messages,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.message?.content) {
        return data.message.content;
      } else if (data.response) {
        return data.response;
      } else {
        throw new Error('No response from model');
      }
    } catch (err) {
      console.error('Error calling Ollama:', err);
      throw new Error(`Failed to get response: ${err.message}. Make sure Ollama is running at ${OLLAMA_URL}`);
    }
  }
}

const agent = new AIWebAgent();
