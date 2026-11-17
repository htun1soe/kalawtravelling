import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Tier 1: Global Google Maps Platform quota & auth failure monitoring
(window as Window & { gm_authFailure?: () => void }).gm_authFailure = () => {
  window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
};

const originalConsoleError = console.error.bind(console);
console.error = (...args: unknown[]) => {
  originalConsoleError(...args);
  const text = args
    .map((a) => (typeof a === 'string' ? a : a instanceof Error ? a.message : String(a ?? '')))
    .join(' ');
  if (
    text.includes('OverQuotaMapError') ||
    text.includes('QuotaExceededError') ||
    text.includes('OVER_QUERY_LIMIT')
  ) {
    window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
  }
};

createRoot(document.getElementById('root')!).render(<App />);
