import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { promptEnhancementService } from './services/apiService';

// Register Service Worker for PWA functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// Enable notifications
if ('Notification' in window && Notification.permission === 'default') {
  Notification.requestPermission();
}

async function initializeApp() {
  try {
    await promptEnhancementService.requestNewSessionToken();
    console.log('Session token initialized successfully.');
  } catch (error) {
    console.error('Failed to initialize session token:', error);
  }

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

initializeApp();