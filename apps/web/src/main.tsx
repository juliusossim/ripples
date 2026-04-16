import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { applyInitialWebTheme } from '@org/ui-web';
import App from './app/app';
import './styles.css';

applyInitialWebTheme();

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
