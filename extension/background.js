// Background Service Worker for AI Web Agent Extension

let monitoringEnabled = false;

// Listen for messages from popup and content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getStatus') {
    sendResponse({ isMonitoring: monitoringEnabled });
  } else if (request.action === 'toggleMonitoring') {
    monitoringEnabled = !monitoringEnabled;
    sendResponse({ isMonitoring: monitoringEnabled });
  } else if (request.action === 'captureTab') {
    chrome.tabs.captureVisibleTab(null, { format: 'png' }, (dataUrl) => {
      sendResponse({ screenshot: dataUrl });
    });
    return true; // Keep channel open for async response
  }
});

// Install event
chrome.runtime.onInstalled.addListener(() => {
  console.log('AI Web Agent Extension installed successfully');
});
