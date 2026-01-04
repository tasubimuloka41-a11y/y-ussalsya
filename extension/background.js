// Background Service Worker for AI Web Agent Extension
// This is intentionally minimal - content.js handles everything

// Listen for messages from other parts of the extension
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'ping') {
    sendResponse({ status: 'pong' });
  }
});

// Install event
chrome.runtime.onInstalled.addListener(() => {
  console.log('Web Agent Extension installed successfully');
});
