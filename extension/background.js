// Background Service Worker for AI Web Agent Extension
importScripts('agent.js');

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Background received message:', request);
  
  if (request.action === 'askAgent') {
    // Forward to agent and get response
    agent.askModel(request.prompt)
      .then(response => {
        console.log('Agent response:', response);
        sendResponse({ success: true, response: response });
      })
      .catch(error => {
        console.error('Agent error:', error);
        sendResponse({ success: false, error: error.message });
      });
    
    // Keep channel open for async response
    return true;
  }
});

// Install event
chrome.runtime.onInstalled.addListener(() => {
  console.log('AI Web Agent Extension installed successfully');
});
