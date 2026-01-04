// Popup script - minimal version
document.addEventListener('DOMContentLoaded', () => {
  const statusDiv = document.getElementById('status');
  const logsDiv = document.getElementById('logs');
  
  if (statusDiv) {
    statusDiv.textContent = '🟢 Extension loaded successfully';
  }
  
  if (logsDiv) {
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.style.color = '#51cf66';
    entry.textContent = '✅ Web Agent side panel is injected on all pages';
    logsDiv.appendChild(entry);
  }
});
