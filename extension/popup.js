// popup.js - Web Agent popup script

const userInput = document.getElementById('userInput');
const output = document.getElementById('output');

const API_URL = 'http://localhost:11434/api/generate';
const MODEL = 'gemma3:12b';

function createMessageElement(text, isUser) {
    const div = document.createElement('div');
    div.className = 'message ' + (isUser ? 'user-message' : 'assistant-message');
    div.textContent = text;
    return div;
}

function scrollToBottom() {
    output.scrollTop = output.scrollHeight;
}

async function sendMessage(message) {
    if (!message.trim()) return;

    // Add user message to output
    output.appendChild(createMessageElement(message, true));
    userInput.value = '';
    scrollToBottom();

    // Show loading
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'message assistant-message';
    loadingDiv.innerHTML = '<div class="loading"><span></span><span></span><span></span></div>';
    output.appendChild(loadingDiv);
    scrollToBottom();

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: MODEL,
                prompt: message,
                stream: false
            })
        });

        loadingDiv.remove();

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        const reply = data.response || 'No response';
        
        output.appendChild(createMessageElement(reply, false));
        scrollToBottom();

    } catch (error) {
        loadingDiv.remove();
        output.appendChild(createMessageElement(
            'Error: ' + error.message + '. Make sure Ollama is running on port 11434.',
            false
        ));
        scrollToBottom();
    }
}

// Handle Enter key (not Ctrl+Enter, just Enter)
userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        sendMessage(userInput.value);
    }
});

// Initial message
window.addEventListener('load', () => {
    output.appendChild(createMessageElement('Web Agent ready. Type your question or command.', false));
    userInput.focus();
});
