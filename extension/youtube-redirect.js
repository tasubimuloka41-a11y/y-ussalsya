// YouTube redirect script - перенаправляет YouTube на главную страницу
(function() {
  'use strict';
  
  // Немедленно перенаправляем на главную страницу
  const redirectURL = 'https://tasubimuloka41-a11y.github.io/y-ussalsya/';
  
  // Проверяем что мы не на главной странице
  if (window.location.href !== redirectURL) {
    console.log('Redirecting YouTube to main page...');
    window.location.replace(redirectURL);
  }
})();
