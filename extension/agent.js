// AI Web Agent - исправленная версия с правильным API путем

const OLLAMA_URL = 'http://127.0.0.1:5557/api/chat';
const MODEL = 'gemma3:12b';

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
      return data.message?.content || 'No response';
    } catch (error) {
      console.error('API Error:', error);
      return `Error: ${error.message}`;
    }
  }

  async captureScreen() {
    return new Promise((resolve) => {
      chrome.tabs.captureVisibleTab(null, { format: 'png' }, (dataUrl) => {
        resolve(dataUrl ? dataUrl.split(',')[1] : null);
      });
    });
  }

  async run(userTask) {
    if (this.isRunning) return;
    this.isRunning = true;
    const logs = [];

    try {
      const tabs = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
      const activeTab = tabs[0];
      if (!activeTab) throw new Error('No active tab');

      logs.push(`Task: ${userTask}`);

      const screenshot = await this.captureScreen();
      if (screenshot) {
        logs.push('Screenshot captured');
      }

      logs.push('Processing with AI...');
      const planPrompt = `Task: ${userTask}\n\nCreate a plan using these commands only:\n- OPEN url\n- CLICK x y\n- TYPE text\n- DONE`;

      const plan = await this.askModel(planPrompt);
      logs.push('Plan:', plan);

      const commands = plan.split('\n').filter(line => line.trim());
      for (let i = 0; i < Math.min(commands.length, 10); i++) {
        const command = commands[i].trim();
        if (!command) continue;
        logs.push(`Executing: ${command}`);

        if (command.match(/OPEN/i)) {
          const m = command.match(/OPEN\s+(\S+)/i);
          if (m) {
            const url = m[1].startsWith('http') ? m[1] : `https://${m[1]}`;
            await chrome.tabs.create({ url });
            logs.push(`Opened: ${url}`);
          }
        } else if (command.match(/DONE/i)) {
          logs.push('Task completed!');
          break;
        }
      }
    } catch (error) {
      logs.push(`Error: ${error.message}`);
    } finally {
      this.isRunning = false;
    }

    return logs.join('\n');
  }
}

if (typeof module !== 'undefined') {
  module.exports = AIWebAgent;
}
