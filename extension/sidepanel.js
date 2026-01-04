// Side panel script - minimal version
// The actual side panel is injected by content.js

document.addEventListener('DOMContentLoaded', () => {
  const outputDiv = document.getElementById('output');
  const statusBar = document.getElementById('statusBar');
  
  if (statusBar) {
    statusBar.textContent = '🟢 Web Agent side panel loaded';
    statusBar.className = 'status-bar connected';
  }
  
  if (outputDiv) {
    const item = document.createElement('div');
    item.className = 'output-item success';
    item.innerHTML = '<div class="output-label">INFO</div><div class="output-text">Side panel is active. The main interface is injected into web pages.</div>';
    outputDiv.appendChild(item);
  }
});
