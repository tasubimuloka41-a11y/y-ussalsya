document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const runAgent = document.getElementById('runAgent');
    const outputDiv = document.getElementById('output');
    const statusBar = document.getElementById('statusBar');

    let isProcessing = false;

    // Initialize status
    updateStatus('Ready', 'connected');

    // Event listener for Send button
    runAgent.addEventListener('click', async () => {
        const task = taskInput.value.trim();
        if (!task) {
            addOutput('Please enter a task or question.', 'error');
            return;
        }
        if (isProcessing) return;

        isProcessing = true;
        runAgent.disabled = true;
        taskInput.disabled = true;
        outputDiv.innerHTML = '';

        try {
            addOutput('Processing task...', 'loading');
            updateStatus('Processing...', 'loading');

            const response = await chrome.runtime.sendMessage({
                action: 'runTask',
                task: task
            });

            outputDiv.innerHTML = '';
            if (response && response.result) {
                addOutput('Task Result:', 'success');
                addOutput(response.result, 'result');
                updateStatus('Completed', 'connected');
            } else if (response && response.error) {
                addOutput('Error: ' + response.error, 'error');
                updateStatus('Error occurred', 'error');
            } else {
                addOutput('No result returned', 'error');
                updateStatus('No result', 'error');
            }
        } catch (error) {
            addOutput('Error: ' + error.message || 'Unknown error', 'error');
            updateStatus('Error: ' + error.message, 'error');
        } finally {
            isProcessing = false;
            runAgent.disabled = false;
            taskInput.disabled = false;
            taskInput.focus();
        }
    });

    // Allow Enter key to submit
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !isProcessing) {
            runAgent.click();
        }
    });

    function addOutput(text, type = 'result') {
        const item = document.createElement('div');
        item.className = 'output-item';
        if (type !== 'result') item.classList.add(type);
        
        if (type === 'loading' || type === 'error' || type === 'success') {
            item.innerHTML = `<div class="output-label">${type.toUpperCase()}</div><div class="output-text">${escapeHtml(text)}</div>`;
        } else {
            item.innerHTML = `<div class="output-text">${escapeHtml(text)}</div>`;
        }
        
        outputDiv.appendChild(item);
        outputDiv.scrollTop = outputDiv.scrollHeight;
    }

    function updateStatus(text, statusClass = '') {
        statusBar.textContent = text;
        statusBar.className = 'status-bar';
        if (statusClass) statusBar.classList.add(statusClass);
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
});
