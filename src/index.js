import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';

const root = ReactDOM.createRoot(document.getElementById('root'));
const isLocalhost = process.env.REACT_APP_BACKBONE.includes('localhost') || process.env.REACT_APP_BACKBONE.includes('127.0.0.1');

root.render(
  isLocalhost ? (
    <React.StrictMode>
      <BrowserRouter>
        <Analytics />
        <App />
      </BrowserRouter>
    </React.StrictMode>
  ) : (
    <BrowserRouter>
      <Analytics />
      <App />
    </BrowserRouter>
  )
);