import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { store } from './store/index.js'
import { Provider } from 'react-redux';
import {QueryClientProvider} from '@tanstack/react-query'
import queryClient from './services/queryClient.js';
import './index.css';
import App from './App.jsx';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </Provider>
  </StrictMode>
);
