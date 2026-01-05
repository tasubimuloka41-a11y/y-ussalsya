// popup.js - Web Agent with file upload support

const userInput = document.getElementById('userInput');
const output = document.getElementById('output');
const sendBtn = document.getElementById('sendBtn');
const uploadBtn = document.getElementById('uploadBtn');
const fileInput = document.getElementById('fileInput');
const filesList = document.getElementById('filesList');

const API_URL = 'http://localhost:11434/api/generate';
const MODEL = 'gemma3:12b';

let selectedFiles = [];

function createMessageElement(text, isUser) {
    const div = document.createElement('div');
    div.className = 'message ' + (isUser ? 'user-message' : 'assistant-message');
    div.textContent = text;
    return div;
}

function scrollToBottom() {
    output.scrollTop = output.scrollHeight;
}

function updateFilesList() {
    filesList.innerHTML = '';
    if (selectedFiles.length === 0) {
        filesList.innerHTML = '<span style="opacity: 0.5; font-size: 12px; color: #888;">No files selected</span>';
        return;
    }
    selectedFiles.forEach((file, index) => {
        const item = document.createElement('div');
        item.className = 'file-item';
        item.innerHTML = `<span>${file.name}</span><span class="remove" onclick="removeFile(${index})">×</span>`;
        filesList.appendChild(item);
    });
}

window.removeFile = function(index) {
    selectedFiles.splice(index, 1);
    updateFilesList();
}

uploadBtn.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', (e) => {
    selectedFiles = Array.from(e.target.files);
    updateFilesList();
    fileInput.value = '';
});

async function sendMessage(message) {
    if (!message.trim()) return;

    // Add user message with file info
    let userMsg = message;
    if (selectedFiles.length > 0) {
        userMsg += ` [Files: ${selectedFiles.map(f => f.name).join(', ')}]`;
    }
    output.appendChild(createMessageElement(userMsg, true));
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
        
        selectedFiles = [];
        updateFilesList();

    } catch (error) {
        loadingDiv.remove();
        output.appendChild(createMessageElement(
            'Error: ' + error.message + '. Make sure Ollama is running on port 11434.',
            false
        ));
        scrollToBottom();
    }
}

// Send button click
sendBtn.addEventListener('click', () => {
    sendMessage(userInput.value);
});

// Ctrl+Enter to send (or Cmd+Enter on Mac)
userInput.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        sendMessage(userInput.value);
    }
});

// Initial setup
window.addEventListener('load', () => {
    output.appendChild(createMessageElement('Web Agent ready. Add files with the + button, type your message, then Ctrl+Enter to send.', false));
    updateFilesList();
    userInput.focus();
});
