import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Add global error handler for debugging
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
});

// Console log for debugging
console.log('App starting - React version:', React.version);

const rootElement = document.getElementById('root');
console.log('Root element found:', rootElement);

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    // <React.StrictMode> can sometimes cause duplicate rendering in development
    // Temporarily removing it for troubleshooting
    <App />
  );
  console.log('App rendered successfully');
} catch (error) {
  console.error('Error rendering app:', error);
  // Fallback rendering in case of error
  const errorDiv = document.createElement('div');
  errorDiv.style.padding = '20px';
  errorDiv.style.color = 'red';
  errorDiv.innerHTML = `<h2>Failed to load application</h2><p>${error.message}</p>`;
  rootElement.appendChild(errorDiv);
}