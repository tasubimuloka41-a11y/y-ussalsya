document.addEventListener('DOMContentLoaded', async () => {
  const toggleBtn = document.getElementById('toggleBtn');
  const statusDiv = document.getElementById('status');
  const logsDiv = document.getElementById('logs');
  
  let isMonitoring = false;
  
  try {
    const response = await chrome.runtime.sendMessage({ action: 'getStatus' });
    isMonitoring = response.isMonitoring;
    updateUI();
  } catch (e) {
    console.error('Extension not ready:', e);
    addLog('Extension initializing...', false);
  }
  
  toggleBtn.addEventListener('click', async () => {
    try {
      const response = await chrome.runtime.sendMessage({ action: 'toggleMonitoring' });
      isMonitoring = response.isMonitoring;
      updateUI();
      addLog('Monitoring ' + (isMonitoring ? 'enabled' : 'disabled'), false);
    } catch (e) {
      addLog('Error: ' + e.message, true);
    }
  });
  
  function updateUI() {
    toggleBtn.textContent = isMonitoring ? 'Stop Monitoring' : 'Start Monitoring';
    toggleBtn.style.background = isMonitoring ? 'rgba(255, 107, 107, 0.5)' : 'rgba(255, 255, 255, 0.3)';
    statusDiv.textContent = isMonitoring ? '🟢 Monitoring active' : '⚫ Monitoring inactive';
  }
  
  function addLog(message, isError = false) {
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.style.color = isError ? '#ff6b6b' : '#51cf66';
    entry.textContent = (isError ? '❌ ' : '✅ ') + message;
    logsDiv.appendChild(entry);
    logsDiv.scrollTop = logsDiv.scrollHeight;
  }
  
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'log') {
      addLog(request.message);
    }
  });
});
