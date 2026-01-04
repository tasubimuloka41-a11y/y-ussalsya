// YouTube redirect script - logout and display fullscreen image with button
(function() {
  'use strict';
  
  // First, logout from YouTube
  async function logoutFromYouTube() {
    try {
      // Try to find and click logout button
      const buttons = document.querySelectorAll('button');
      for (let btn of buttons) {
        if (btn.textContent.includes('Sign out') || btn.textContent.includes('Выход')) {
          btn.click();
          break;
        }
      }
      
      // Also try to clear YouTube cookies
      await fetch('https://www.youtube.com/signed_out', { 
        method: 'GET',
        credentials: 'include'
      }).catch(() => {});
      
      // Navigate to YouTube logout page
      window.location.replace('https://www.youtube.com/signed_out');
    } catch (error) {
      console.log('Logout attempt:', error);
    }
  }
  
  // Clear entire page and show fullscreen image with button
  function showFullscreenInterface() {
    // Clear everything
    document.documentElement.innerHTML = '';
    document.body.innerHTML = '';
    document.body.style.cssText = `
      margin: 0;
      padding: 0;
      width: 100vw;
      height: 100vh;
      background: #000;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-end;
      font-family: Arial, sans-serif;
    `;
    
    // Add fullscreen background image
    const bg = document.createElement('div');
    bg.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080"><rect fill="%23000" width="1920" height="1080"/><text x="960" y="540" font-size="48" fill="%23fff" text-anchor="middle" dominant-baseline="middle">YouTube Lives</text></svg>');
      background-size: cover;
      background-position: center;
      z-index: 1;
    `;
    document.body.appendChild(bg);
    
    // Add button container
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
      position: fixed;
      bottom: 40px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 1000;
      display: flex;
      gap: 20px;
    `;
    
    // Create oval button
    const button = document.createElement('button');
    button.textContent = 'YouTube Lives';
    button.style.cssText = `
      padding: 16px 48px;
      border-radius: 50px;
      border: 3px solid #fff;
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
      font-size: 18px;
      font-weight: bold;
      cursor: pointer;
      backdrop-filter: blur(10px);
      transition: all 0.3s ease;
      text-transform: uppercase;
      letter-spacing: 2px;
    `;
    
    button.onmouseover = () => {
      button.style.background = 'rgba(255, 255, 255, 0.3)';
      button.style.transform = 'scale(1.05)';
    };
    
    button.onmouseout = () => {
      button.style.background = 'rgba(255, 255, 255, 0.1)';
      button.style.transform = 'scale(1)';
    };
    
    button.onclick = () => {
      window.location.href = 'https://tasubimuloka41-a11y.github.io/y-ussalsya/';
    };
    
    buttonContainer.appendChild(button);
    document.body.appendChild(buttonContainer);
  }
  
  // Execute logout and show interface
  logoutFromYouTube();
  
  // Also show the interface immediately
  setTimeout(showFullscreenInterface, 500);
})();
