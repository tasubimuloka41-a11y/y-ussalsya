// Content script that runs on web pages
console.log('AI Web Agent content script loaded');

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getPageInfo') {
    const pageInfo = {
      title: document.title,
      url: window.location.href,
      description: document.querySelector('meta[name="description"]')?.content || ''
    };
    sendResponse(pageInfo);
  }
  else if (request.action === 'executeScript') {
    try {
      const result = eval(request.script);
      sendResponse({ success: true, result: result });
    } catch (e) {
      sendResponse({ success: false, error: e.message });
    }
  }
});

// Send ready signal
chrome.runtime.sendMessage({ 
  action: 'contentReady', 
  url: window.location.href 
}).catch(() => {
  console.log('Extension not ready yet');
});
