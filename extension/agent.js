// AI web agent - исправленная версия с /api/generate endpoint

const OLLAMA_URL = 'http://127.0.0.1:11434/api/generate';
const MODEL = 'emma3:12b'

class AIWebAgent {
  constructor() {
    this.conversationHistory = [];
    this.isRunning = false;
  }

  async askModel(prompt, imageBase64 = null) {
    try {
      const response = await fetch(OLLAMA_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: MODEL,
          prompt: prompt,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.response) {
        return data.response.trim();
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

// Handle messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'askAgent') {
    agent.askModel(request.prompt)
      .then(response => {
        sendResponse({ success: true, response: response });
      })
      .catch(error => {
        sendResponse({ success: false, error: error.message });
      });
    return true;
  }
});

// Expose agent globally for console access
window.aiAgent = agent;
