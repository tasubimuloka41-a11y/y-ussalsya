document.addEventListener('DOMContentLoaded', () => {
  const taskInput = document.getElementById('taskInput');
  const runButton = document.getElementById('runAgent');
  const outputDiv = document.getElementById('agentOutput');
  
  runButton.addEventListener('click', async () => {
    const task = taskInput.value.trim();
    if (!task) {
      addOutput('❌ Please enter a task');
      return;
    }
    
    addOutput('🔄 Processing task...');
    
    try {
      const response = await chrome.runtime.sendMessage({
        action: 'runTask',
        task: task
      });
      
      if (response && response.result) {
        addOutput('✅ Task completed!');
        addOutput('Result: ' + response.result);
      } else {
        addOutput('✅ Task executed');
      }
    } catch (e) {
      addOutput('❌ Error: ' + (e.message || 'Unknown error'));
    }
  });
  
  // Allow Enter key to run task
  taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      runButton.click();
    }
  });
  
  function addOutput(message) {
    const time = new Date().toLocaleTimeString();
    const entry = document.createElement('div');
    entry.style.marginBottom = '5px';
    entry.textContent = `[${time}] ${message}`;
    outputDiv.appendChild(entry);
    outputDiv.scrollTop = outputDiv.scrollHeight;
  }
  
  // Listen for messages from background
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'updateOutput') {
      addOutput(request.message);
    }
  });
});
