
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

try {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log('React app mounted successfully');
} catch (error) {
  console.error('Failed to mount React app:', error);
  rootElement.innerHTML = `
    <div style="padding: 20px; background: #1a202c; color: #e2e8f0; font-family: sans-serif;">
      <h1>Application Failed to Load</h1>
      <p>Error: ${error.message}</p>
      <p>Please check the console for more details.</p>
    </div>
  `;
}
