import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import './transitions.css';

// Create a root element
const rootElement = document.getElementById('root');

// Ensure the root element exists
if (!rootElement) {
  throw new Error('Root element not found');
}

// Create a root
const root = createRoot(rootElement);

// Render with BrowserRouter to provide routing context
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
