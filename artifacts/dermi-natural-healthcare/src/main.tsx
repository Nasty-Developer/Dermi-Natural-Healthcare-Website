import { createRoot, hydrateRoot } from 'react-dom/client';

import App from './App';
import { ErrorBoundary } from '@/components/error-boundary';

import './index.css';

const root = document.getElementById('root')!;
const app = (
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
const rootOptions = {
  // Keeps caught errors off reportError(), which would raise the dev overlay.
  onCaughtError: (error: unknown, errorInfo: { componentStack?: string | null }) => {
    console.error(error, errorInfo.componentStack);
  },
};

if (root.hasChildNodes()) {
  hydrateRoot(root, app, rootOptions);
  window.requestAnimationFrame(() => {
    document.documentElement.removeAttribute('data-static-seo');
  });
} else {
  createRoot(root, rootOptions).render(app);
}
