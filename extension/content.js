// Content script that injects side panel on all pages

// Create and inject side panel into the page
function injectSidePanel() {
  // Check if already injected
  if (document.getElementById('web-agent-side-panel')) {
    return;
  }

  // Create container for side panel
  const container = document.createElement('div');
  container.id = 'web-agent-side-panel';
  container.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 350px;
    height: 100vh;
    background: white;
    border-right: 1px solid #e0e0e0;
    z-index: 999999;
    display: flex;
    flex-direction: column;
    box-shadow: 2px 0 10px rgba(0,0,0,0.1);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  `;

  // Create header
  const header = document.createElement('div');
  header.style.cssText = `
    background: #667eea;
    color: white;
    padding: 16px;
    font-size: 16px;
    font-weight: 600;
    text-align: center;
  `;
  header.textContent = '✨ Web Agent';
  container.appendChild(header);

  // Create messages area
  const messagesArea = document.createElement('div');
  messagesArea.id = 'web-agent-messages';
  messagesArea.style.cssText = `
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    background: #f9f9f9;
  `;
  container.appendChild(messagesArea);

  // Create input area
  const inputArea = document.createElement('div');
  inputArea.style.cssText = `
    padding: 12px;
    background: white;
    border-top: 1px solid #e0e0e0;
    display: flex;
    gap: 8px;
    flex-direction: column;
  `;

  const input = document.createElement('input');
  input.id = 'web-agent-input';
  input.type = 'text';
  input.placeholder = 'Ask anything...';
  input.style.cssText = `
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 13px;
    font-family: inherit;
  `;

  const sendBtn = document.createElement('button');
  sendBtn.id = 'web-agent-send';
  sendBtn.textContent = 'Send';
  sendBtn.style.cssText = `
    padding: 10px 16px;
    background: #667eea;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    font-size: 13px;
  `;

  inputArea.appendChild(input);
  inputArea.appendChild(sendBtn);
  container.appendChild(inputArea);

  // Inject into page
  document.body.insertBefore(container, document.body.firstChild);

  // Adjust page margin to accommodate side panel
  document.body.style.marginLeft = '350px';

  // Add event listeners
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleSendMessage(input, messagesArea);
    }
  });
  sendBtn.addEventListener('click', () => {
    handleSendMessage(input, messagesArea);
  });
}

function handleSendMessage(inputEl, messagesArea) {
  const text = inputEl.value.trim();
  if (!text) return;

  // Add user message to display
  const userMsg = document.createElement('div');
  userMsg.style.cssText = `
    margin-bottom: 12px;
    display: flex;
    justify-content: flex-end;
  `;
  const userText = document.createElement('div');
  userText.style.cssText = `
    max-width: 85%;
    padding: 10px 12px;
    background: #667eea;
    color: white;
    border-radius: 6px;
    word-wrap: break-word;
    line-height: 1.3;
    font-size: 13px;
  `;
  userText.textContent = text;
  userMsg.appendChild(userText);
  messagesArea.appendChild(userMsg);
  messagesArea.scrollTop = messagesArea.scrollHeight;

  inputEl.value = '';
  inputEl.disabled = true;

  // Send message to agent
  chrome.runtime.sendMessage(
    { action: 'askAgent', prompt: text },
    (response) => {
      inputEl.disabled = false;
      inputEl.focus();

      if (response && response.success) {
        const aiMsg = document.createElement('div');
        aiMsg.style.cssText = `
          margin-bottom: 12px;
          display: flex;
          justify-content: flex-start;
        `;
        const aiText = document.createElement('div');
        aiText.style.cssText = `
          max-width: 85%;
          padding: 10px 12px;
          background: white;
          color: #333;
          border: 1px solid #e0e0e0;
          border-radius: 6px;
          word-wrap: break-word;
          line-height: 1.3;
          font-size: 13px;
        `;
        aiText.textContent = response.response;
        aiMsg.appendChild(aiText);
        messagesArea.appendChild(aiMsg);
      } else {
        const errMsg = document.createElement('div');
        errMsg.style.cssText = `
          margin-bottom: 12px;
          display: flex;
          justify-content: flex-start;
        `;
        const errText = document.createElement('div');
        errText.style.cssText = `
          max-width: 85%;
          padding: 10px 12px;
          background: #ffebee;
          color: #c62828;
          border: 1px solid #ef5350;
          border-radius: 6px;
          word-wrap: break-word;
          line-height: 1.3;
          font-size: 13px;
        `;
        errText.textContent = `Error: ${response?.error || 'Unknown error'}`;
        errMsg.appendChild(errText);
        messagesArea.appendChild(errMsg);
      }
      messagesArea.scrollTop = messagesArea.scrollHeight;
    }
  );
}

// Inject side panel when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injectSidePanel);
} else {
  injectSidePanel();
}

console.log('Web Agent side panel injected');
