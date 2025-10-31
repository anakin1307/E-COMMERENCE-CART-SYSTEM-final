import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// 👇️ Must import BrowserRouter from react-router-dom
import { BrowserRouter } from 'react-router-dom'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    {/* ✅ FIX: App must be wrapped in BrowserRouter to enable routing */}
    <BrowserRouter> 
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
