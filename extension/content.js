// Content script that injects side panel on all pages

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    PANEL_ID: 'web-agent-side-panel',
    PANEL_WIDTH: 400,
    OLLAMA_URL: 'http://127.0.0.1:11434/api/generate'
  };

  // Create and inject side panel into the page
  function injectSidePanel() {
    // Check if already injected
    if (document.getElementById(CONFIG.PANEL_ID)) {
      return;
    }

    // Create container for side panel
    const container = document.createElement('div');
    container.id = CONFIG.PANEL_ID;
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: ${CONFIG.PANEL_WIDTH}px;
      height: 100vh;
      background: #ffffff;
      border-right: 1px solid #d0d0d0;
      z-index: 999999;
      display: flex;
      flex-direction: column;
      box-shadow: 2px 0 8px rgba(0,0,0,0.08);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 14px;
    `;

    // Create header
    const header = document.createElement('div');
    header.style.cssText = `
      background: #f5f5f5;
      color: #333;
      padding: 16px;
      font-size: 14px;
      font-weight: 600;
      text-align: center;
      border-bottom: 1px solid #d0d0d0;
    `;
    header.textContent = 'Web Agent';

    // Create chat area
    const chatArea = document.createElement('div');
    chatArea.style.cssText = `
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      background: #ffffff;
      display: flex;
      flex-direction: column;
      gap: 12px;
    `;

    // Create input area
    const inputArea = document.createElement('div');
    inputArea.style.cssText = `
      padding: 16px;
      border-top: 1px solid #d0d0d0;
      background: #fafafa;
      display: flex;
      gap: 8px;
    `;

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Ask something...';
    input.style.cssText = `
      flex: 1;
      padding: 8px 12px;
      border: 1px solid #d0d0d0;
      border-radius: 4px;
      font-size: 14px;
      font-family: inherit;
    `;

    const sendBtn = document.createElement('button');
    sendBtn.textContent = 'Send';
    sendBtn.style.cssText = `
      padding: 8px 16px;
      background: #f5f5f5;
      border: 1px solid #d0d0d0;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      color: #333;
    `;

    sendBtn.addEventListener('mouseover', () => {
      sendBtn.style.background = '#e8e8e8';
    });
    sendBtn.addEventListener('mouseout', () => {
      sendBtn.style.background = '#f5f5f5';
    });

    sendBtn.addEventListener('click', async () => {
      const message = input.value.trim();
      if (!message) return;

      // Add user message to chat
      addMessageToChat(message, 'user', chatArea);
      input.value = '';

      // Get response from Ollama
      try {
        const response = await fetch(CONFIG.OLLAMA_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'llama2',
            prompt: message,
            stream: false
          })
        });

        const data = await response.json();
        addMessageToChat(data.response, 'assistant', chatArea);
      } catch (error) {
        addMessageToChat('Error: ' + error.message, 'error', chatArea);
      }
    });

    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        sendBtn.click();
      }
    });

    inputArea.appendChild(input);
    inputArea.appendChild(sendBtn);

    // Assemble panel
    container.appendChild(header);
    container.appendChild(chatArea);
    container.appendChild(inputArea);

    // Insert into page
    document.documentElement.insertBefore(container, document.documentElement.firstChild);

    // Adjust page content to account for panel
    const style = document.createElement('style');
    style.textContent = `
      body {
        margin-left: ${CONFIG.PANEL_WIDTH}px;
      }
    `;
    document.head.appendChild(style);

    console.log('Web Agent side panel injected successfully');
  }

  function addMessageToChat(text, type, chatArea) {
    const messageEl = document.createElement('div');
    messageEl.style.cssText = `
      padding: 8px 12px;
      border-radius: 4px;
      word-wrap: break-word;
      font-size: 13px;
      max-width: 100%;
    `;

    if (type === 'user') {
      messageEl.style.background = '#e8f4f8';
      messageEl.style.color = '#333';
      messageEl.style.textAlign = 'right';
    } else if (type === 'assistant') {
      messageEl.style.background = '#f0f0f0';
      messageEl.style.color = '#333';
    } else {
      messageEl.style.background = '#fcc';
      messageEl.style.color = '#c33';
    }

    messageEl.textContent = text;
    chatArea.appendChild(messageEl);
    chatArea.scrollTop = chatArea.scrollHeight;
  }

  // Inject panel when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectSidePanel);
  } else {
    injectSidePanel();
  }

  // Also listen for dynamically added pages
  window.addEventListener('load', injectSidePanel);
})();
