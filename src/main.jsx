import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import FearsFoundationPage from './FearsFoundationPage.jsx';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Fears Foundation: mount node #root was not found in the document.');
}

createRoot(container).render(
  <StrictMode>
    <FearsFoundationPage />
  </StrictMode>,
);
